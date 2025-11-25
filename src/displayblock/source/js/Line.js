/**
 * Represents a 3D line connecting two points in space.
 * Can be used to visually connect two items.
 * @class Line
 * @extends Item
 */
class Line extends Item {
  /**
   * Length of the line in pixels.
   * @type {number}
   * @private
   */
  _length = 100;

  /**
   * Thickness of the line in pixels.
   * @type {number}
   * @private
   */
  _weight = 1;

  /**
   * Color of the line.
   * @type {string}
   * @private
   */
  _color = '#fff';

  /**
   * Whether the line direction is reversed.
   * @type {boolean}
   * @private
   */
  _reversed = false;

  /**
   * Start point coordinates.
   * @type {{x: number, y: number, z: number}}
   * @private
   */
  _start = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Origin point coordinates.
   * @type {{x: number, y: number, z: number}}
   * @protected
   */
  _origin = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * End point coordinates.
   * @type {{x: number, y: number, z: number}}
   * @private
   */
  _end = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Items connected by this line.
   * @type {{start: Item|null, end: Item|null}}
   * @private
   */
  _connectedItems = {
    start: null,
    end: null,
  };

  /**
   * Creates a new Line instance.
   * @param {number} [weight=1] - The thickness of the line in pixels.
   * @param {string} [color='#fff'] - The color of the line.
   */
  constructor(weight = 1, color = '#fff') {
    super();

    this._weight = weight;
    this._color = color;

    this.getWrapper().classList.add('line');
    this.getElement().classList.add('line');
    this.getElement().style.width = this._length + this.unit;

    this.getElement().innerHTML =
      '<div class="side side--0" style="transform: rotateX(0deg); background-color: ' + this._color + '"></div>' +
      '<div class="side side--1" style="transform: rotateX(90deg) translateZ(' + this._weight + 'px); background-color: ' + this._color + ';"></div>';

    this.setTranformOrigin('0 0');
  }

  /**
   * Updates the line position when a connected item moves.
   * @param {Item} item - The item that moved.
   */
  updatePosition(item) {
    const centerEnd = this._connectedItems.end.getCenter();
    const centerStart = this._connectedItems.start.getCenter();

    if (this.isReversed()) {
      this.setStart(centerEnd.x, centerEnd.y, centerEnd.z);
      this.setEnd(centerStart.x, centerStart.y, centerStart.z);
    } else {
      this.setStart(centerStart.x, centerStart.y, centerStart.z);
      this.setEnd(centerEnd.x, centerEnd.y, centerEnd.z);
    }

    this.draw();
  }

  /**
   * Determines if the line direction should be reversed based on connected item positions.
   * @returns {boolean} True if the line should be reversed.
   */
  isReversed() {
    const start = this._connectedItems.start.getCenter();
    const end = this._connectedItems.end.getCenter();

    if (
      (start.x > end.x && start.y >= end.y) ||
      (start.x < end.x && start.y > end.y) ||
      (start.x === end.x && start.y > end.y && start.z === end.z) ||
      (start.x === end.x && start.y > end.y && start.z < end.z) ||
      (start.x === end.x && start.y === end.y && start.z > end.z)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Connects two items with this line.
   * @param {Item} itemStart - The starting item.
   * @param {Item} itemEnd - The ending item.
   * @returns {Line} The current instance for method chaining.
   */
  connectItems(itemStart, itemEnd) {
    this._connectedItems.start = itemStart;
    this._connectedItems.end = itemEnd;

    itemStart.addConnection(this);
    itemEnd.addConnection(this);

    const start = this._connectedItems.start.getCenter();
    const end = this._connectedItems.end.getCenter();

    if (this.isReversed()) {
      this._reversed = true;
      this.setStart(end.x, end.y, end.z);
      this.setEnd(start.x, start.y, start.z);
    } else {
      this.setStart(start.x, start.y, start.z);
      this.setEnd(end.x, end.y, end.z);
    }
    return this;
  }

  /**
   * Gets the start coordinate for a specific axis.
   * @param {string} axe - The axis ('x', 'y', or 'z').
   * @returns {number} The coordinate value.
   */
  getStart(axe) {
    return this._start[axe];
  }

  /**
   * Sets the start point of the line.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @param {number} z - The Z coordinate.
   * @returns {Line} The current instance for method chaining.
   */
  setStart(x, y, z) {
    this._start.x = x;
    this._start.y = y;
    this._start.z = z;

    this._origin.x = x;
    this._origin.y = y;
    this._origin.z = z;

    this.setX(x);
    this.setY(y);
    this.setZ(z);

    return this;
  }

  /**
   * Sets the end point of the line and calculates the rotation angles.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @param {number} z - The Z coordinate.
   * @returns {Line} The current instance for method chaining.
   */
  setEnd(x, y, z) {
    this._end.x = x;
    this._end.y = y;
    this._end.z = z;

    const saveStart = {
      x: this._start.x,
      y: this._start.y,
      z: this._start.z,
    };

    const xDelta = this._end.x - this._start.x;
    const yDelta = this._end.y - this._start.y;
    const zDelta = this._end.z - this._start.z;

    if (this._start.z !== 0) {
      this._end.z -= this._start.z;
      this._start.z = 0;
    }

    let length;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    if (xDelta) {
      length = Math.abs(xDelta);
    }

    if (yDelta) {
      length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
    }

    if (zDelta) {
      if (xDelta) {
        length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(zDelta, 2));
        if (yDelta) {
          length = Math.sqrt(Math.pow(length, 2) + Math.pow(yDelta, 2));
        }
      } else if (yDelta) {
        length = Math.sqrt(Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
      }
      if (!length) {
        length = Math.abs(zDelta);
      }
    }

    // Calculate rotation angles
    if (zDelta && !yDelta && !xDelta) {
      angleY = (90 * Math.PI) / 180;
    }
    if (!zDelta && yDelta && !xDelta) {
      angleZ = (90 * Math.PI) / 180;
    } else if (zDelta && !yDelta && xDelta) {
      angleY = Math.atan(zDelta / xDelta);
    } else if (zDelta && yDelta && !xDelta) {
      angleX = Math.atan(zDelta / yDelta);
      angleZ = (90 * Math.PI) / 180;
    } else if (!zDelta && yDelta && xDelta) {
      angleZ = Math.atan(yDelta / xDelta);
    } else if (zDelta && yDelta && xDelta) {
      angleY = Math.acos(xDelta / length);
      const z1 = Math.sin(angleY) * length;
      angleX = Math.asin(this._end.z / z1) - Math.PI / 2;
    }

    // Convert to degrees
    angleX = (angleX / Math.PI) * 180;
    angleY = (angleY / Math.PI) * -180;
    angleZ = (angleZ / Math.PI) * 180;

    this._start.z = saveStart.z;
    this._length = Math.round(length);

    this.setRotations(angleX, angleY, angleZ);
    this.draw();

    return this;
  }

  /**
   * Draws the line by applying CSS transforms.
   */
  draw() {
    super.draw();

    this.getElement().style.width = this._length + this.unit;
    this.getElement().style.height = this._weight + this.unit;
  }
}
