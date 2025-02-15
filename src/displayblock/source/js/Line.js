class Line extends Item
{


  _length = 100;
  _weight = 1;
  _color = '#fff';
  _reversed = false;

  _start = {
    x: 0,
    y: 0,
    z: 0,
  };

  _origin = {
    x: 0,
    y: 0,
    z: 0,
  };

  _end = {
    x: 0,
    y: 0,
    z: 0,
  };

  _connectedItems = {
    start: null,
    end: null,
  };


  constructor(weight = 1, color = '#fff') {

    super();

    this._weight = weight;
    this._color = color;

    this.getWrapper().classList.add('line');
    this.getElement().classList.add('line');
    this.getElement().style.width = this._length + this.unit;

    //this.getElement().style.height = this._weight + this.unit;

    //this.getElement().style.backgroundColor = this._color;
    //this.getElement().style.borderTopWeight = this._weight + this.unit;


    this.getElement().innerHTML =
      '<div class="side side--0" style="transform: rotateX(0deg); background-color: ' + this._color + '"></div>' +
      '<div  class="side side--1"style="transform: rotateX(90deg) translateZ(' + (this._weight) + 'px); background-color: ' + this._color + ';"></div>'
    ;

    /*
   this.getElement().innerHTML =
    '<div class="side side--0" style="transform: rotateX(0deg) ; border-color: ' + this._color + '; border-width: ' + (this._weight / 2) + 'px"></div>' +
    '<div  class="side side--1"style="transform: rotateX(90deg) translateZ(' + (this._weight * 3) + 'px); border-color: ' + this._color + '; border-width: ' + (this._weight / 2) + 'px"></div>'
  ;
  */

    this.setTranformOrigin('0 0');
  }

  updatePosition(item) {

    let centerEnd = this._connectedItems.end.getCenter();
    let centerStart = this._connectedItems.start.getCenter();

    if(this.isReversed()) {
      this.setStart(centerEnd.x, centerEnd.y, centerEnd.z);
      this.setEnd(centerStart.x, centerStart.y, centerStart.z);
    }
    else {
      this.setStart(centerStart.x, centerStart.y, centerStart.z);
      this.setEnd(centerEnd.x, centerEnd.y, centerEnd.z);
    }

    this.draw();
  }

  isReversed() {
    let start = this._connectedItems.start.getCenter();
    let end = this._connectedItems.end.getCenter();

    if(
      (
        (start.x > end.x && start.y >= end.y)
        || (start.x < end.x && start.y > end.y)

        || (start.x == end.x && start.y > end.y && start.z == end.z)
        || (start.x == end.x && start.y > end.y && start.z < end.z)
        || (start.x == end.x && start.y == end.y && start.z > end.z)
      )
    ) {
      return true;
    }
    else {
      return false;
    }
  }


  connectItems(itemStart, itemEnd) {

    this._connectedItems.start = itemStart;
    this._connectedItems.end = itemEnd;

    itemStart.addConnection(this);
    itemEnd.addConnection(this);

    let start = this._connectedItems.start.getCenter();
    let end = this._connectedItems.end.getCenter();

    if(this.isReversed()) {
      // console.log('INVERT');
      this._reversed = true;
      this.setStart(end.x, end.y, end.z);
      this.setEnd(start.x, start.y, start.z);
    }
    else {
      this.setStart(start.x, start.y, start.z);
      this.setEnd(end.x, end.y, end.z);
    }
    return this;
  }




  getStart(axe) {
    return this._start[axe];
  }

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

  setEnd(x, y, z) {

    this._end.x = x;
    this._end.y = y;
    this._end.z = z;

    let saveStart = {
      x: this._start.x,
      y: this._start.y,
      z: this._start.z,
    };

    let saveEnd = {
      x: this._end.x,
      y: this._end.y,
      z: this._end.z,
    };

    let xDelta = this._end.x - this._start.x;
    let yDelta = this._end.y - this._start.y;
    let zDelta = this._end.z - this._start.z;



    if(this._start.z != 0) {
      this._end.z -= this._start.z;
      this._start.z = 0;
    }


    let length;

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    if(xDelta) {
      length = Math.abs(xDelta);
    }

    if(yDelta) {
      length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
    }

    if(zDelta) {
      if(xDelta) {
        length = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(zDelta, 2));
        if(yDelta) {
          length = Math.sqrt(Math.pow(length, 2) + Math.pow(yDelta, 2));
        }
      }
      else if(yDelta) {
        length = Math.sqrt(Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
      }
      if(!length) {
        length = Math.abs(zDelta);
      }
    }



    //=========================================================

    if(zDelta && !yDelta && !xDelta) {
      angleY = 90 * Math.PI / 180;
    }
    if(!zDelta && yDelta && !xDelta) {
      angleZ = 90 * Math.PI / 180;
    }
    else if(zDelta && !yDelta  && xDelta ) {
      angleY = Math.atan( zDelta/ xDelta);
    }
    else if(zDelta && yDelta  && !xDelta ) {
      angleX = Math.atan( zDelta / yDelta);
      angleZ = 90 * Math.PI / 180;
    }
    else if(!zDelta && yDelta  && xDelta ) {
      angleZ = Math.atan( yDelta / xDelta);
    }
    else if(zDelta && yDelta  && xDelta ) {

        // console.log('manyRotation');
        // console.log('%c' + xDelta + ',' + yDelta + ',' + zDelta, 'color: #0bf; font-size: 1rem; background-color:#fff');
        // console.log('%c' + length, 'color: #5Af; font-size: 1rem; background-color:#fff');

        angleY = Math.acos(xDelta / length);

        // console.log('%c' + angleY / Math.PI * 180, 'color: #5A0; font-size: 1rem; background-color:#fff');

        let z1 = Math.sin(angleY) * length;

        // console.log('%c' + z1, 'color: #5A0; font-size: 1rem; background-color:#fff');

        angleX = Math.asin((this._end.z) / z1) - Math.PI/2;

    }

    // ============================================================

    angleX = angleX/Math.PI * 180;
    angleY = angleY/Math.PI * -180;
    angleZ = angleZ/Math.PI * 180;

    this._start.z = saveStart.z;

    this._length = Math.round(length);

    this.setRotations(angleX, angleY, angleZ);

    this.draw();

    return this;
  }



  draw() {

    super.draw();

    this.getElement().style.width = this._length + this.unit;
    this.getElement().style.height = this._weight + this.unit;
  }



}
