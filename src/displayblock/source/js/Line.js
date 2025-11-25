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
   *
   * The line is rendered as a horizontal bar along the positive X-axis starting
   * at the origin. To orient it from start to end point, we apply rotations.
   *
   * Coordinate system:
   * - X-axis: points right (positive X = right)
   * - Y-axis: points down (positive Y = down, typical for screen coordinates)
   * - Z-axis: points toward the viewer (positive Z = toward viewer)
   *
   * @param {number} x - The X coordinate of the end point.
   * @param {number} y - The Y coordinate of the end point.
   * @param {number} z - The Z coordinate of the end point.
   * @returns {Line} The current instance for method chaining.
   */
  setEnd(x, y, z) {
    this._end.x = x;
    this._end.y = y;
    this._end.z = z;

    // Save start Z position to restore later (needed for proper scene rendering)
    const saveStart = {
      x: this._start.x,
      y: this._start.y,
      z: this._start.z,
    };

    // Calculate displacement vector from start to end
    const xDelta = this._end.x - this._start.x;
    const yDelta = this._end.y - this._start.y;
    const zDelta = this._end.z - this._start.z;

    // Normalize Z coordinates for calculation (translate to origin on Z axis)
    if (this._start.z !== 0) {
      this._end.z -= this._start.z;
      this._start.z = 0;
    }

    let length;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    /*
     * LENGTH CALCULATION:
     * Calculate the 3D Euclidean distance using Pythagorean theorem.
     * The calculation is done incrementally based on which axes have deltas.
     */

    // Case: only X delta - length is simply |xDelta|
    if (xDelta) {
      length = Math.abs(xDelta);
    }

    // Case: Y delta present - calculate XY plane distance: sqrt(dx² + dy²)
    if (yDelta) {
      length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
    }

    // Case: Z delta present - extend calculation to 3D
    if (zDelta) {
      if (xDelta) {
        // First get XZ distance: sqrt(dx² + dz²)
        length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(zDelta, 2));
        if (yDelta) {
          // Then extend to full 3D: sqrt(xz_length² + dy²)
          length = Math.sqrt(Math.pow(length, 2) + Math.pow(yDelta, 2));
        }
      } else if (yDelta) {
        // No X delta: YZ distance = sqrt(dy² + dz²)
        length = Math.sqrt(Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
      }
      // Only Z delta: length is simply |zDelta|
      if (!length) {
        length = Math.abs(zDelta);
      }
    }

    /*
     * ROTATION ANGLE CALCULATIONS:
     *
     * The line starts along the positive X-axis. We need to rotate it to point
     * toward the end point. CSS applies rotations in order: rotateX, rotateY, rotateZ.
     *
     * - angleZ: Rotation in the XY plane (around Z-axis) - angles the line horizontally
     * - angleY: Rotation in the XZ plane (around Y-axis) - tilts line into/out of screen
     * - angleX: Rotation in the YZ plane (around X-axis) - additional tilt adjustment
     *
     * Using atan2(y, x) instead of atan(y/x) for correct quadrant handling.
     */

    // Case: Only Z delta (line goes straight into/out of screen)
    // Rotate 90° around Y-axis to point along Z-axis
    if (zDelta && !yDelta && !xDelta) {
      angleY = (90 * Math.PI) / 180;
    }

    // Case: Only Y delta (line goes straight up/down)
    // Rotate 90° around Z-axis to point along Y-axis
    if (!zDelta && yDelta && !xDelta) {
      angleZ = (90 * Math.PI) / 180;
    }
    // Case: X and Z deltas only (line in XZ plane)
    // Use atan to calculate Y rotation for tilt into screen
    else if (zDelta && !yDelta && xDelta) {
      angleY = Math.atan(zDelta / xDelta);
    }
    // Case: Y and Z deltas only (line in YZ plane)
    // Rotate 90° around Z, then use atan for X tilt
    else if (zDelta && yDelta && !xDelta) {
      angleX = Math.atan(zDelta / yDelta);
      angleZ = (90 * Math.PI) / 180;
    }
    // Case: X and Y deltas only (line in XY plane, the screen plane)
    // Use atan2 for correct angle calculation in all quadrants
    // atan2(y, x) returns angle from -π to π, handling negative x correctly
    else if (!zDelta && yDelta && xDelta) {
      angleZ = Math.atan2(yDelta, xDelta);
    }
    // Case: All three deltas (full 3D line)
    // Use spherical coordinate approach:
    // 1. angleY from acos gives polar angle from X-axis
    // 2. angleX adjusts for the Z component
    else if (zDelta && yDelta && xDelta) {
      angleY = Math.acos(xDelta / length);
      const z1 = Math.sin(angleY) * length;
      angleX = Math.asin(this._end.z / z1) - Math.PI / 2;
    }

    // Convert radians to degrees for CSS transforms
    // Note: angleY is negated because CSS rotateY positive direction
    // rotates the positive X-axis toward negative Z
    angleX = (angleX / Math.PI) * 180;
    angleY = (angleY / Math.PI) * -180;
    angleZ = (angleZ / Math.PI) * 180;

    // Restore original start Z position
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
