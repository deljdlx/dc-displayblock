/**
 * Handles user interactions (mouse drag, rotation, zoom) for the viewport.
 * @class ViewportInteraction
 */
class ViewportInteraction {
  /**
   * The viewport being controlled.
   * @type {Viewport}
   * @private
   */
  _viewport;

  /**
   * Interaction states for drag and rotation.
   * @type {{drag: {enable: boolean, left: number|null, top: number|null}, rotation: {enable: boolean, rotationX: number|null, rotationY: number|null, rotationZ: number|null, left: number|null, top: number|null}}}
   */
  states = {
    drag: {
      enable: false,
      left: null,
      top: null,
    },
    rotation: {
      enable: false,
      rotationX: null,
      rotationY: null,
      rotationZ: null,
      left: null,
      top: null,
    },
  };

  /**
   * Counter for throttling drag events.
   * @type {number}
   */
  dragInterval = 0;

  /**
   * Creates a new ViewportInteraction instance.
   * @param {Viewport} viewport - The viewport to add interactions to.
   */
  constructor(viewport) {
    this._viewport = viewport;
  }

  /**
   * Sets up event listeners for interactive controls.
   */
  makeInteractive() {
    document.body.addEventListener('wheel', (evt) => this.handleWheel(evt));
    document.body.addEventListener('mousedown', (evt) => this.dragStart(evt));
    document.body.addEventListener('mouseup', (evt) => this.dragStop(evt));
    document.body.addEventListener('mousemove', (evt) => this.drag(evt));
    document.body.addEventListener('contextmenu', (evt) => this.rotate(evt));
  }

  /**
   * Handles right-click context menu (prevents default).
   * @param {MouseEvent} evt - The context menu event.
   */
  rotate(evt) {
    evt.preventDefault();
  }

  /**
   * Handles mouse drag movement for panning and rotation.
   * @param {MouseEvent} evt - The mouse move event.
   */
  drag(evt) {
    evt.preventDefault();

    this.dragInterval++;
    this.dragInterval = this.dragInterval % 5;

    if (this.dragInterval) {
      return;
    }

    if (this.states.drag.enable) {
      const xDelta = evt.clientX - this.states.drag.left;
      const yDelta = evt.clientY - this.states.drag.top;

      this._viewport.setPositions(xDelta, yDelta);
      this._viewport.applyTransformations();
    } else if (this.states.rotation.enable) {
      const xDelta = evt.clientX - this.states.rotation.left;
      const yDelta = evt.clientY - this.states.rotation.top;

      this._viewport.setRotations(
        Math.round(this.states.rotation.rotationX + yDelta / 10),
        Math.round(this.states.rotation.rotationY + xDelta / 10)
      );

      this._viewport.applyTransformations();
    }
  }

  /**
   * Handles mouse button press to start drag or rotation.
   * @param {MouseEvent} evt - The mouse down event.
   */
  dragStart(evt) {
    if (evt.which === 1) {
      // Left click - start drag
      this.states.drag.enable = true;
      this.states.drag.left = evt.clientX - this._viewport.getX();
      this.states.drag.top = evt.clientY - this._viewport.getY();
    } else if (evt.which === 3) {
      // Right click - start rotation
      this.states.rotation.enable = true;

      this.states.rotation.left = evt.clientX;
      this.states.rotation.top = evt.clientY;

      this.states.rotation.rotationX = this._viewport.getRotation('x');
      this.states.rotation.rotationY = this._viewport.getRotation('y');
      this.states.rotation.rotationZ = this._viewport.getRotation('z');
    }
  }

  /**
   * Handles mouse button release to stop drag or rotation.
   * @param {MouseEvent} evt - The mouse up event.
   */
  dragStop(evt) {
    evt.preventDefault();
    this.states.drag.enable = false;
    this.states.drag.left = null;
    this.states.drag.top = null;

    this.states.rotation.enable = false;
    this.states.rotation.left = null;
    this.states.rotation.top = null;
    this.states.rotation.rotationX = this.rotationX;
    this.states.rotation.rotationY = this.rotationY;
    this.states.rotation.rotationZ = this.rotationZ;
  }

  /**
   * Handles mouse wheel events for zooming.
   * @param {WheelEvent} evt - The wheel event.
   */
  handleWheel(evt) {
    // Wheel handling is currently disabled
    // Uncomment below to enable zoom functionality:
    // const delta = evt.deltaY;
    // if (delta > 0) {
    //   this._viewport.setZ(this._viewport.getZ() - 70);
    // } else {
    //   this._viewport.setZ(this._viewport.getZ() + 70);
    // }
    // this._viewport.applyTransformations();
  }
}