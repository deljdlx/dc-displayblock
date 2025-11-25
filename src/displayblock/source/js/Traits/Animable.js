/**
 * Adds animation capabilities to renderable elements.
 * Provides methods for animated translations, rotations, and continuous rotation loops.
 * @class Animable
 * @extends Renderable
 */
class Animable extends Renderable {
  /**
   * Animation manager for rotation loops.
   * @type {Animation}
   * @protected
   */
  _rotationLoopManager = null;

  /**
   * Creates a new Animable instance.
   */
  constructor() {
    super();
    this._rotationLoopManager = new Animation(this);
  }

  /**
   * Translates the element by a relative amount with animation.
   * @param {number} x - Amount to translate on X axis.
   * @param {number} y - Amount to translate on Y axis.
   * @param {number} z - Amount to translate on Z axis.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  translateBy(x, y, z, duration = 5000, callback = null) {
    const translation = new Animation(this);
    translation.translateBy(x, y, z, duration, callback);
  }

  /**
   * Translates the element to an absolute position with animation.
   * @param {number} x - Target X coordinate.
   * @param {number} y - Target Y coordinate.
   * @param {number} z - Target Z coordinate.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  translateTo(x, y, z, duration = 5000, callback = null) {
    const translation = new Animation(this);
    translation.translateTo(x, y, z, duration, callback);
  }

  // ====================== ROTATION MANAGEMENT ==========================

  /**
   * Rotates the element by a relative amount with animation.
   * @param {number} x - Amount to rotate around X axis in degrees.
   * @param {number} y - Amount to rotate around Y axis in degrees.
   * @param {number} z - Amount to rotate around Z axis in degrees.
   * @param {number} [duration=1] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  rotateBy(x, y, z, duration = 1, callback = null) {
    const rotation = new Animation(this);
    rotation.rotateBy(x, y, z, duration, callback);
  }

  /**
   * Flattens the element by rotating it to (0, 0, 0) with animation.
   * @param {number} duration - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  flatten(duration, callback = null) {
    this.disableRotations();
    this._rotationLoopManager.flatten(duration, callback);
  }

  // ====================== ROTATION LOOP MANAGEMENT ==========================

  /**
   * Stops any currently running rotation loop animation.
   */
  disableRotations() {
    this._rotationLoopManager.disableRotations();
  }

  /**
   * Enables continuous rotation animation that loops indefinitely.
   * @param {number|boolean} [x=true] - Amount to rotate around X axis per cycle, or true for default.
   * @param {number|boolean} [y=true] - Amount to rotate around Y axis per cycle, or true for default.
   * @param {number|boolean} [z=true] - Amount to rotate around Z axis per cycle, or true for default.
   * @param {number} [duration=5000] - Duration of one rotation cycle in milliseconds.
   */
  enableRotations(x = true, y = true, z = true, duration = 5000) {
    this._rotationLoopManager.enableRotations(x, y, z, duration);
  }

  /**
   * Checks if rotation animation is currently active.
   * @returns {boolean} True if rotation is enabled, false otherwise.
   */
  rotationEnabled() {
    return this._rotationLoopManager.rotationEnabled();
  }
}
