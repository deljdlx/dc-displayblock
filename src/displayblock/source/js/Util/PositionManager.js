/**
 * Base class for managing 3D positions and rotations of elements.
 * Provides methods for getting and setting position coordinates and rotation angles.
 * @class PositionManager
 */
class PositionManager {
  /**
   * Unit for position values.
   * @type {string}
   */
  unit = 'px';

  /**
   * Unit for rotation values.
   * @type {string}
   */
  rotationUnit = 'deg';

  /**
   * Position coordinates in 3D space.
   * @type {{x: number, y: number, z: number}}
   * @private
   */
  _positions = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Rotation angles around each axis.
   * @type {{x: number, y: number, z: number}}
   * @private
   */
  _rotations = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Sets the rotation around the X axis.
   * @param {number} value - The rotation angle in degrees.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setRotationX(value) {
    this._rotations.x = value;
    return this;
  }

  /**
   * Sets the rotation around the Y axis.
   * @param {number} value - The rotation angle in degrees.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setRotationY(value) {
    this._rotations.y = value;
    return this;
  }

  /**
   * Sets the rotation around the Z axis.
   * @param {number} value - The rotation angle in degrees.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setRotationZ(value) {
    this._rotations.z = value;
    return this;
  }

  /**
   * Sets rotation angles around one or more axes.
   * @param {number|null} [x=null] - The rotation angle around the X axis, or null to keep current value.
   * @param {number|null} [y=null] - The rotation angle around the Y axis, or null to keep current value.
   * @param {number|null} [z=null] - The rotation angle around the Z axis, or null to keep current value.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setRotations(x = null, y = null, z = null) {
    if (x !== null) {
      this._rotations.x = x;
    }
    if (y !== null) {
      this._rotations.y = y;
    }
    if (z !== null) {
      this._rotations.z = z;
    }
    return this;
  }

  /**
   * Gets the current position coordinates.
   * @returns {{x: number, y: number, z: number}} The current position object.
   */
  getPositions() {
    return this._positions;
  }

  /**
   * Updates connected lines when position changes.
   * @protected
   */
  updateConnections() {
    for (const connection of this._connections) {
      connection.updatePosition(this);
    }
  }

  /**
   * Sets position coordinates in 3D space.
   * @param {number|null} [x=null] - The X coordinate, or null to keep current value.
   * @param {number|null} [y=null] - The Y coordinate, or null to keep current value.
   * @param {number|null} [z=null] - The Z coordinate, or null to keep current value.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setPositions(x = null, y = null, z = null) {
    if (x !== null) {
      this._positions.x = x;
    }
    if (y !== null) {
      this._positions.y = y;
    }
    if (z !== null) {
      this._positions.z = z;
    }
    this.updateConnections();
    return this;
  }

  /**
   * Sets the X coordinate.
   * @param {number} value - The X coordinate value.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setX(value) {
    this._positions.x = value;
    this.updateConnections();
    return this;
  }

  /**
   * Sets the Y coordinate.
   * @param {number} value - The Y coordinate value.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setY(value) {
    this._positions.y = value;
    this.updateConnections();
    return this;
  }

  /**
   * Sets the Z coordinate.
   * @param {number} value - The Z coordinate value.
   * @returns {PositionManager} The current instance for method chaining.
   */
  setZ(value) {
    this._positions.z = value;
    this.updateConnections();
    return this;
  }

  /**
   * Gets the X coordinate.
   * @returns {number} The X coordinate value.
   */
  getX() {
    return this._positions.x;
  }

  /**
   * Gets the Y coordinate.
   * @returns {number} The Y coordinate value.
   */
  getY() {
    return this._positions.y;
  }

  /**
   * Gets the Z coordinate.
   * @returns {number} The Z coordinate value.
   */
  getZ() {
    return this._positions.z;
  }

  /**
   * Gets the rotation angle around a specific axis.
   * @param {string} axe - The axis ('x', 'y', or 'z').
   * @returns {number} The rotation angle in degrees.
   */
  getRotation(axe) {
    return this._rotations[axe];
  }

  /**
   * Gets a copy of all rotation values.
   * @returns {{x: number, y: number, z: number}} A copy of the rotations object.
   */
  getRotations() {
    return { ...this._rotations };
  }

  /**
   * Restores the position and rotation from previously saved values.
   * @returns {PositionManager} The current instance for method chaining.
   */
  restorePosition() {
    this.positions.x = this.savedX;
    this.positions.y = this.savedY;
    this.positions.z = this.savedZ;

    this.rotationX = this.savedRotationX;
    this.rotationY = this.savedRotationY;
    this.rotationZ = this.savedRotationZ;

    return this;
  }

  /**
   * Saves the current position and rotation for later restoration.
   * @returns {PositionManager} The current instance for method chaining.
   */
  savePosition() {
    this.savedX = this.x;
    this.savedY = this.y;
    this.savedZ = this.z;

    this.savedRotationX = this.rotationX;
    this.savedRotationY = this.rotationY;
    this.savedRotationZ = this.rotationZ;

    return this;
  }
}
