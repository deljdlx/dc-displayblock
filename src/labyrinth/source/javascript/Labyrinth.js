class Labyrinth
{

  width = 32;
  height = 32;


  matrix = [];

  start = null;
  end = null;


  pathes = [];

  constructor(width = 64, height = 64)
  {
    this.width = width;
    this.height = height;

    for(let y = 0 ; y < this.height ; y++) {
      for(let x = 0 ; x < this.width ; x++) {
        if(typeof(this.matrix[x]) === 'undefined') {
          this.matrix[x] = [];
        }
        this.matrix[x][y] = new Cell(x, y);
      }
    }

    this.setStart(0,0);
    this.setEnd(this.width - 1 , this.height - 1);
  }


  reset() {
    this.pathes = [];
    this.matrix = [];
    for(let y = 0 ; y < this.height ; y++) {
      for(let x = 0 ; x < this.width ; x++) {
        if(typeof(this.matrix[x]) === 'undefined') {
          this.matrix[x] = [];
        }
        this.matrix[x][y] = new Cell(x, y);
      }
    }
  }


  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  getMatrix() {
    return this.matrix;
  }

  generate() {
    
    
    let saveEnd = this.end;
    this.end = this.cell(Math.floor(this.width-1), Math.floor(this.height/2));

    let path0 = new Path(this, this.getStart(), this.end);
    path0.setCssClass('path-main')
    path0.generate();
    this.pathes.push(path0);


    this.end = saveEnd;
    let path1 = new Path(this, this.getStart(), this.end);
    path1.setCssClass('path-main2')
    path1.generate();
    this.pathes.push(path1);


    if(path1.isValid()) {
      console.log("SUCCESS");
    }
    else {
      console.log("FAILED");
      this.closePath(path1);
    }

    if(!path1.isValid) {
      this.reset();
      return this.generate();
    }

    for(let i = 0 ; i < 5 ; i++) {
      this.generateNoise();
    }
    return true;

  }


  closePath(path) {
    let altern = -1;
    for(let i = 0; i<20; i++) {

      let target;
      if(altern>0) {
        target = this.farest(this.getEnd());
      }
      else {
        target = this.closest(this.getEnd());
      }
      altern *= -1;
      
      target.addCssClass('closest')

      let newPath = new Path(this, target, this.getEnd());
      newPath.setCssClass('closing-path');
      newPath.generate();


      if(path.isValid()) {
        console.log("SUCCESS");
        break;
      }
      this.pathes.push(newPath);
      path = newPath;
    }
  }

  generateNoise(stop = true) {

    let noises = [];
    for(let path of this.pathes) {
      for(let cell of path.getPath()) {
        let noise = new Path(this, cell, this.getEnd());
        noise.setCssClass('noise0');
        noise.generate();
        noises.push(noise);
      }
    }

    for(let noise of noises) {
      this.pathes.push(noise)
    }
  }


  closest(target) {
    let minDistance = this.width * this.height;
    let closest;

    for(let path of this.pathes) {
      let localClosest = path.closest(target);
      let distance =
      Math.sqrt(
        Math.pow(Math.abs(localClosest.getX() - target.getX()),2) +
        Math.pow(Math.abs(localClosest.getY() - target.getY()),2)
      );
  
      if(distance < minDistance) {
        minDistance = distance;
        closest = localClosest;
      }
    }
    return closest;
  }

  farest(target) {
    let maxDistance = 0;
    let farest;

    for(let path of this.pathes) {
      let localFarest = path.farest(target);
      let distance =
      Math.sqrt(
        Math.pow(Math.abs(localFarest.getX() - target.getX()),2) +
        Math.pow(Math.abs(localFarest.getY() - target.getY()),2)
      );
  
      if(distance > maxDistance) {
        maxDistance = distance;
        farest = localFarest;
      }
    }
    return farest;
  }



  cell(x, y) {
    if(typeof(this.matrix[x]) !== 'undefined') {
      if(typeof(this.matrix[x][y]) !== 'undefined') {
        return this.matrix[x][y];
      }
    }

    return false;
    
  }

  setStart(x, y) {
    this.start = this.cell(x,y);
  }

  setEnd(x, y) {
    this.end = this.cell(x,y);
  }


  getStart() {
    return this.start;
  }

  getEnd(x, y) {
    return this.end;
  }
}