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
   * at the origin. To orient it from start to end point, we need to apply rotations.
   *
   * Coordinate system:
   * - X-axis: points right (positive X = right)
   * - Y-axis: points down (positive Y = down, typical for screen coordinates)
   * - Z-axis: points toward the viewer (positive Z = toward viewer)
   *
   * Rotation order applied by CSS: rotateX, then rotateY, then rotateZ
   * (but we calculate angles considering the final orientation needed)
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

    // Calculate the delta (displacement vector) from start to end
    const xDelta = this._end.x - this._start.x;
    const yDelta = this._end.y - this._start.y;
    const zDelta = this._end.z - this._start.z;

    // Calculate the 3D Euclidean distance (length of the line)
    // Using Pythagorean theorem in 3D: length = sqrt(dx² + dy² + dz²)
    const length = Math.sqrt(xDelta * xDelta + yDelta * yDelta + zDelta * zDelta);

    // Initialize rotation angles (in radians)
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    // Handle edge case where start and end points are the same
    if (length === 0) {
      this._length = 0;
      this.setRotations(0, 0, 0);
      this.draw();
      return this;
    }

    // Calculate the projection of the line onto the XY plane
    // This is the horizontal distance ignoring the Z component
    // projectionXY = sqrt(dx² + dy²)
    const projectionXY = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

    /*
     * ROTATION CALCULATIONS:
     *
     * We need to orient a line that starts along the positive X-axis to point
     * from start to end. We do this using two rotations:
     *
     * 1. rotateZ (rotation around Z-axis, in the XY plane):
     *    This angles the line in the horizontal plane (screen plane).
     *    angleZ = atan2(yDelta, xDelta)
     *    - atan2 handles all four quadrants correctly
     *    - When xDelta > 0, yDelta = 0: angleZ = 0 (pointing right)
     *    - When xDelta = 0, yDelta > 0: angleZ = 90° (pointing down)
     *    - When xDelta < 0, yDelta = 0: angleZ = ±180° (pointing left)
     *    - When xDelta = 0, yDelta < 0: angleZ = -90° (pointing up)
     *
     * 2. rotateY (rotation around Y-axis, tilting the line into/out of screen):
     *    After rotating in XY plane, we need to tilt the line to account for Z.
     *    The tilt angle is calculated using the projection onto XY plane and zDelta.
     *    angleY = -atan2(zDelta, projectionXY)
     *    - Negative because rotateY with positive angle tilts the positive X-axis
     *      toward negative Z (away from viewer), but we want positive zDelta
     *      to tilt toward the viewer
     *    - When zDelta = 0: angleY = 0 (no tilt, line stays in XY plane)
     *    - When zDelta > 0 and projectionXY = 0: line points directly at viewer
     *    - When zDelta < 0 and projectionXY = 0: line points away from viewer
     */

    // Calculate Z-axis rotation (rotation in the XY plane)
    // atan2(y, x) returns angle in radians from -π to π
    angleZ = Math.atan2(yDelta, xDelta);

    // Calculate Y-axis rotation (tilt into/out of screen)
    // Only needed if there's horizontal distance or Z distance
    if (projectionXY > 0 || zDelta !== 0) {
      // Use atan2 for correct quadrant handling
      // Negative sign because positive Y rotation tilts toward -Z
      angleY = -Math.atan2(zDelta, projectionXY);
    }

    // Note: angleX remains 0 because after rotateZ and rotateY,
    // the line is correctly oriented. rotateX would only be needed
    // for additional twisting around the line's own axis.

    // Convert radians to degrees for CSS transforms
    // Formula: degrees = radians * (180 / π)
    angleX = (angleX / Math.PI) * 180;
    angleY = (angleY / Math.PI) * 180;
    angleZ = (angleZ / Math.PI) * 180;

    // Store the calculated length (rounded to avoid sub-pixel rendering issues)
    this._length = Math.round(length);

    // Apply the calculated rotations and redraw the line
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
