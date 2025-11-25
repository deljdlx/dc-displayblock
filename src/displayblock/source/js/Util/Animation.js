/**
 * Handles animation of translations and rotations for 3D elements.
 * Uses requestAnimationFrame for smooth animations.
 * @class Animation
 */
class Animation {
  /**
   * Last timestamp from requestAnimationFrame.
   * @type {number|null}
   * @private
   */
  _lastTimestamp = null;

  /**
   * Total duration of the animation in milliseconds.
   * @type {number|null}
   * @private
   */
  _duration = null;

  /**
   * Start time of the animation.
   * @type {number|null}
   * @private
   */
  _startTime = null;

  /**
   * Current animation frame ID.
   * @type {number|null}
   * @private
   */
  _animation = null;

  /**
   * Rotation animation state.
   * @type {{target: {x: number|null, y: number|null, z: number|null}, increments: {x: number|null, y: number|null, z: number|null}}}
   * @private
   */
  _rotations = {
    target: {
      x: null,
      y: null,
      z: null,
    },
    increments: {
      x: null,
      y: null,
      z: null,
    },
  };

  /**
   * Translation animation state.
   * @type {{x: number|null, y: number|null, z: number|null, target: {x: number|null, y: number|null, z: number|null}, increments: {x: number|null, y: number|null, z: number|null}}}
   * @private
   */
  _translations = {
    x: null,
    y: null,
    z: null,
    target: {
      x: null,
      y: null,
      z: null,
    },
    increments: {
      x: null,
      y: null,
      z: null,
    },
  };

  /**
   * The item being animated.
   * @type {Animable}
   * @private
   */
  _item;

  /**
   * Creates a new Animation instance.
   * @param {Animable} element - The item to animate.
   */
  constructor(element) {
    this._item = element;
  }

  /**
   * Placeholder for general animation method.
   * @param {number} duration - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  animate(duration, callback = null) {
    // To be implemented
  }

  // ====================== TRANSLATION MANAGEMENT ==========================

  /**
   * Translates the item to an absolute position.
   * @param {number} [x=0] - Target X coordinate.
   * @param {number} [y=0] - Target Y coordinate.
   * @param {number} [z=0] - Target Z coordinate.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  translateTo(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this.translateBy(
      x - this._item.getX(),
      y - this._item.getY(),
      z - this._item.getZ(),
      duration,
      callback
    );
  }

  /**
   * Translates the item by a relative amount.
   * @param {number} [x=0] - Amount to translate on X axis.
   * @param {number} [y=0] - Amount to translate on Y axis.
   * @param {number} [z=0] - Amount to translate on Z axis.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  translateBy(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this._duration = duration;
    this._startTime = null;
    this._lastTimestamp = null;

    this._translations.x = x;
    this._translations.y = y;
    this._translations.z = z;

    this._translations.target.x = x + this._item.getX();
    this._translations.target.y = y + this._item.getY();
    this._translations.target.z = z + this._item.getZ();

    this._translations.increments.x = this._translations.x / duration;
    this._translations.increments.y = this._translations.y / duration;
    this._translations.increments.z = this._translations.z / duration;

    this.animateTranslation(duration, callback);
  }

  /**
   * Performs the translation animation frame by frame.
   * @param {number} duration - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   * @private
   */
  animateTranslation(duration, callback = null) {
    this._animation = requestAnimationFrame((timestamp) => {
      if (!this._startTime) {
        this._startTime = timestamp;
      }

      if (this._lastTimestamp) {
        const elapsed = timestamp - this._lastTimestamp;

        const translationX = elapsed * this._translations.increments.x;
        const translationY = elapsed * this._translations.increments.y;
        const translationZ = elapsed * this._translations.increments.z;

        this._item.setPositions(
          this._item.getX() + translationX,
          this._item.getY() + translationY,
          this._item.getZ() + translationZ
        );
        this._item.applyTransformations();
      }

      this._lastTimestamp = timestamp;
      const remaining = duration - (timestamp - this._startTime);

      if (remaining >= 0) {
        this.animateTranslation(duration, callback);
      } else {
        this._item.setPositions(
          this._translations.target.x,
          this._translations.target.y,
          this._translations.target.z
        );
        this._item.applyTransformations();

        this.disableTranslation();
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * Stops the current translation animation.
   */
  disableTranslation() {
    cancelAnimationFrame(this._animation);
    this._animation = null;
  }

  // ====================== ROTATION MANAGEMENT ==========================

  /**
   * Flattens the item by rotating it to (0, 0, 0).
   * @param {number} duration - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  flatten(duration, callback) {
    this.rotateTo(0, 0, 0, duration, callback);
  }

  /**
   * Rotates the item to an absolute angle.
   * @param {number} [x=0] - Target X rotation in degrees.
   * @param {number} [y=0] - Target Y rotation in degrees.
   * @param {number} [z=0] - Target Z rotation in degrees.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  rotateTo(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this.rotateBy(
      x - this._item.getRotation('x'),
      y - this._item.getRotation('y'),
      z - this._item.getRotation('z'),
      duration,
      callback
    );
  }

  /**
   * Rotates the item by a relative amount.
   * @param {number} [x=0] - Amount to rotate around X axis in degrees.
   * @param {number} [y=0] - Amount to rotate around Y axis in degrees.
   * @param {number} [z=0] - Amount to rotate around Z axis in degrees.
   * @param {number} [duration=5000] - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   */
  rotateBy(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this._duration = duration;
    this._startTime = null;
    this._lastTimestamp = null;

    this._rotations.increments.x = x / duration;
    this._rotations.increments.y = y / duration;
    this._rotations.increments.z = z / duration;

    this._rotations.target.x = (this._item.getRotation('x') + x) % 360;
    this._rotations.target.y = (this._item.getRotation('y') + y) % 360;
    this._rotations.target.z = (this._item.getRotation('z') + z) % 360;

    this.animateRotation(duration, callback);
  }

  /**
   * Performs the rotation animation frame by frame.
   * @param {number} duration - Animation duration in milliseconds.
   * @param {Function|null} [callback=null] - Callback to execute when animation completes.
   * @private
   */
  animateRotation(duration, callback = null) {
    this._animation = requestAnimationFrame((timestamp) => {
      if (!this._startTime) {
        this._startTime = timestamp;
      }

      if (this._lastTimestamp) {
        const elapsed = timestamp - this._lastTimestamp;

        this._item.setRotations(
          this._item.getRotation('x') + elapsed * this._rotations.increments.x,
          this._item.getRotation('y') + elapsed * this._rotations.increments.y,
          this._item.getRotation('z') + elapsed * this._rotations.increments.z
        );
        this._item.applyTransformations();
      }

      this._lastTimestamp = timestamp;
      const remaining = duration - (timestamp - this._startTime);

      if (remaining >= 0) {
        this.animateRotation(duration, callback);
      } else {
        this._item.setRotations(
          this._item.getRotation('x') % 360,
          this._item.getRotation('y') % 360,
          this._item.getRotation('z') % 360
        );

        this.disableRotations();
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   * Stops the current rotation animation.
   */
  disableRotations() {
    cancelAnimationFrame(this._animation);
    this._animation = null;
  }

  /**
   * Enables continuous rotation animation that loops indefinitely.
   * @param {number} [x=0] - Amount to rotate around X axis per cycle in degrees.
   * @param {number} [y=0] - Amount to rotate around Y axis per cycle in degrees.
   * @param {number} [z=0] - Amount to rotate around Z axis per cycle in degrees.
   * @param {number} [duration=5000] - Duration of one rotation cycle in milliseconds.
   */
  enableRotations(x = 0, y = 0, z = 0, duration = 5000) {
    this.rotateBy(x, y, z, duration, () => {
      this.enableRotations(x, y, z, duration);
    });
  }

  /**
   * Checks if rotation animation is currently active.
   * @returns {boolean} True if rotation is enabled, false otherwise.
   */
  rotationEnabled() {
    return this._animation !== null;
  }
}
