class Animation
{

  _lastTimestamp = null;
  _duration = null;
  _startTime = null;
  _animation = null;

  _rotations = {
    target: {
      x: null,
      y: null,
      z: null,
    },
    increments : {
      x: null,
      y: null,
      z: null,
    }
  };

  _translations = {
    x: null,
    y: null,
    z: null,
    target: {
      x: null,
      y: null,
      z: null,
    },
    increments : {
      x: null,
      y: null,
      z: null,
    }
  };


  _item;

  constructor(element) {
    this._item = element;
  }

  animate(duration, callback = null) {


  }


  //======================TRANSLATION MANAGEMENT==========================

  translateTo(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this.translateBy(
      x - this._item.getX(),
      y - this._item.getY(),
      z - this._item.getZ(),
      duration,
      callback,
    );
  }


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

    this._translations.increments.x =  this._translations.x / duration;
    this._translations.increments.y =  this._translations.y / duration;
    this._translations.increments.z =  this._translations.z / duration;
    this.animateTranslation(duration, callback);
  }


  animateTranslation(duration, callback = null) {


    this._animation = requestAnimationFrame((timestamp) => {

      if(!this._startTime) {
        this._startTime = timestamp;
      }


      let translationX = null;
      let translationY = null;
      let translationZ = null;

      if(this._lastTimestamp) {
        let elapsed = timestamp - this._lastTimestamp;

        translationX = (elapsed * this._translations.increments.x);
        translationY = (elapsed * this._translations.increments.y);
        translationZ = (elapsed * this._translations.increments.z);

        this._item.setPositions(
          this._item.getX() + translationX,
          this._item.getY() + translationY,
          this._item.getZ() + translationZ
        );
        this._item.applyTransformations();

      }

      this._lastTimestamp = timestamp;
      const remaining = duration - (timestamp - this._startTime);


      if(remaining >= 0) {
        this.animateTranslation(duration, callback);
      }
      else {
        this._item.setPositions(
          this._translations.target.x,
          this._translations.target.y,
          this._translations.target.z
        );
        this._item.applyTransformations();

        this.disableTranslation();
        if(callback) {
          callback();
        }
      }

    });
    return;
  }

  disableTranslation() {
    cancelAnimationFrame(this._animation);
    this._animation = null;
  }


  //======================ROTATION MANAGEMENT==========================


  flatten(duration, callback) {
    this.rotateTo(0, 0, 0, duration, callback);
  }

  rotateTo(x = 0, y = 0, z = 0, duration = 5000, callback = null) {
    this.rotateBy(
      x - this._item.getRotation('x'),
      y - this._item.getRotation('y'),
      z - this._item.getRotation('z'),
      duration,
      callback,
    );
  }


  rotateBy(x = 0, y = 0, z = 0, duration = 5000, callback = null) {

    // console.log(this._item);

    this._duration = duration;
    this._startTime = null;
    this._lastTimestamp = null;

    this._rotations.increments.x =  x / duration;
    this._rotations.increments.y =  y / duration;
    this._rotations.increments.z =  z / duration;

    this._rotations.target.x = (this._item.getRotation('x') + x) % 360;
    this._rotations.target.y = (this._item.getRotation('y') + y) % 360;
    this._rotations.target.z = (this._item.getRotation('z') + z) % 360;

    this.animateRotation(duration, callback);
  }



  animateRotation(duration, callback = null) {


    this._animation = requestAnimationFrame((timestamp) => {

      if(!this._startTime) {
        this._startTime = timestamp;
      }

      if(this._lastTimestamp) {
        let elapsed = timestamp - this._lastTimestamp;

        this._item.setRotations(
          this._item.getRotation('x') + (elapsed * this._rotations.increments.x),
          this._item.getRotation('y') + (elapsed * this._rotations.increments.y),
          this._item.getRotation('z') + (elapsed * this._rotations.increments.z)
        );
        this._item.applyTransformations();
      }

      this._lastTimestamp = timestamp;
      const remaining = duration - (timestamp - this._startTime);

      if(remaining >= 0) {
        this.animateRotation(duration, callback);
      }
      else {

        this._item.setRotations(
           this._item.getRotation('x') % 360,
           this._item.getRotation('y') % 360,
           this._item.getRotation('z') % 360
        );

        this.disableRotations();
        if(callback) {
          callback();
        }
      }
    });
    return;
  }


  disableRotations() {
    cancelAnimationFrame(this._animation);
    this._animation = null;

  }

  enableRotations(x = 0, y = 0, z = 0, duration = 5000) {

    this.rotateBy(x, y, z, duration, () => {
      this.enableRotations(x, y, z, duration);
    });
  }

  rotationEnabled() {
    if(this._animation) {
      return true;
    }
    else {
      return false;
    }
  }
}


