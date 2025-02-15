class Animable extends Renderable
{
  _rotationLoopManager = null;

  constructor() {
    super();
    this._rotationLoopManager = new Animation(this);
  }



  translateBy(x, y, z, duration = 5000 , callback = null) {
    let translation =  new Animation(this);
    translation.translateBy(x, y, z, duration, callback);
  }

  translateTo(x, y, z, duration = 5000 , callback = null) {
    let translation =  new Animation(this);
    translation.translateTo(x, y, z, duration, callback);
  }


  //======================ROTATION MANAGEMENT==========================
  rotateBy(x, y, z, duration = 1 , callback = null) {
    let rotation =  new Animation(this);
    rotation.rotateBy(x, y, z, duration, callback);
  }

  flatten(duration, callback = null) {
    this.disableRotations();
    this._rotationLoopManager.flatten(duration , callback);
  }


  //======================ROTATION LOOP MANAGEMENT==========================

  disableRotations() {
    this._rotationLoopManager.disableRotations();

  }

  enableRotations(x = true, y = true, z = true, duration = 5000) {
    this._rotationLoopManager.enableRotations(x, y, z, duration);
  }

  rotationEnabled() {
    return this._rotationLoopManager.rotationEnabled();
  }
}
