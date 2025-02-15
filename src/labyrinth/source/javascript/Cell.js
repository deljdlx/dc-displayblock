class Cell
{
 
  x = null;
  y = null;

  _isPath = false;
  _locked = false;


  cssClass = [];

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getCSSClasses() {
    return this.cssClass;
  }

  addCssClass(cssClass) {
    this.cssClass.push(cssClass);
  }

  getKey() {
    return this.getX() + '-' + this.getY();
  }

  isPath(value = null) {
    if(value !== null) {
      this._isPath = value;
      return this;
    }

    return this._isPath;
  }

  isLocked(value = null) {
    if(value !== null) {
      this._locked = value;
      return this;
    }

    return this._locked;
  }



  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

}