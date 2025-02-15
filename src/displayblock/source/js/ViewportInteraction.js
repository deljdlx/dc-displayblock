class ViewportInteraction {

  _viewport;

  states = {
    drag: {
        enable: false,
        left: null,
        top: null
    },
    rotation: {
        enable: false,
        rotationX: null,
        rotationY: null,
        rotationZ:null
    }
  };

  dragInterval = 0;


  constructor(viewport) {
    this._viewport = viewport;
  }

  makeInteractive() {
    document.body.addEventListener('wheel', (evt) => this.handleWheel(evt));
    document.body.addEventListener('mousedown', (evt) => this.dragStart(evt));
    document.body.addEventListener('mouseup', (evt) => this.dragStop(evt));
    document.body.addEventListener('mousemove', (evt) => this.drag(evt));
    document.body.addEventListener('contextmenu', (evt) => this.rotate(evt));
  }



  rotate(evt) {
    evt.preventDefault();
  }

  drag(evt) {

    evt.preventDefault;

    this.dragInterval++;
    this.dragInterval = this.dragInterval % 5;

    if (this.dragInterval) {
      return;
    }

    if (this.states.drag.enable) {
      let xDelta = (evt.clientX - this.states.drag.left); // (this.perspective / 20);
      let yDelta = (evt.clientY - this.states.drag.top); // (this.perspective / 20);

      this._viewport.setPositions(
        xDelta,
        yDelta
      );
      //this._viewport.top = yDelta;

      this._viewport.applyTransformations();


    } else if (this.states.rotation.enable) {

      let xDelta = (evt.clientX - this.states.rotation.left); // (this.perspective / 20);
      let yDelta = (evt.clientY - this.states.rotation.top); // (this.perspective / 20);

      this._viewport.setRotations(
        Math.round(this.states.rotation.rotationX + yDelta / 10),
        Math.round(this.states.rotation.rotationY + xDelta / 10)
      );



      this._viewport.applyTransformations();
    }
  }

  dragStart(evt) {
    // console.log('drag-start');
    // evt.preventDefault();

    if (evt.which == 1) {
      this.states.drag.enable = true;
      this.states.drag.left = evt.clientX - this._viewport.getX();
      this.states.drag.top = evt.clientY - this._viewport.getY();
    } else if (evt.which == 3) {
      this.states.rotation.enable = true;

      this.states.rotation.left = evt.clientX;
      this.states.rotation.top = evt.clientY;

      this.states.rotation.rotationX = this._viewport.getRotation('x');
      this.states.rotation.rotationY = this._viewport.getRotation('y');
      this.states.rotation.rotationZ = this._viewport.getRotation('z');

    }
  }

  dragStop(evt) {
    // console.log('drag-stop');
    evt.preventDefault();
    this.states.drag.enable = false;
    this.states.drag.left = null;
    this.states.drag.top = null;

    this.states.rotation.enable = false;
    this.states.rotation.left = null;
    this.states.rotation.top = null;
    this.states.rotation.rotationX = this.rotationX;
    this.states.rotation.rotationY = this.rotationY;
    this.states.rotation.rotationZ = this.rotationZ;
  }


  handleWheel(evt) {
    //evt.preventDefault();

    let delta = evt.deltaY;

    //console.log(this._viewport.getZ());

    /*
    if (delta > 0) {
      //this._viewport.translate(-70);
      this._viewport.setZ(
        this._viewport.getZ() -70
      );
    } else {
      this._viewport.setZ(
        this._viewport.getZ() + 70
      );
    }
    this._viewport.applyTransformations();
    */

  }




}