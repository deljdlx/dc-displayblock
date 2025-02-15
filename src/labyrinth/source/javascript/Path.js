class Path
{
 
  labyrinth = null;
  start = null;
  end = null;


  cssClass = null;
  

  cells = {};
  currentCell = null;

  path = [];
  currentIndex = 0;

  try = 0;
  maxTry = 20;

  constructor(labyrinth, start, end) {
    this.labyrinth = labyrinth;
    this.start = start;
    this.end = end;
  }

  setCssClass(cssClass) {
    this.cssClass = cssClass;
  }

  isValid() {
    return this.finished(this.path[this.path.length-1]);
  }


  exists(cell) {
    console.log(cell.getKey())
    if(typeof(this.cells[cell.getKey()]) !== 'undefined') {
      return true;
    }
    return false;
  }


  generate() {

    this.currentCell = this.start;
    let noLoop = 0;
    const maxLoop = this.labyrinth.getHeight() * this.labyrinth.getWidth();

    while(!this.finished(this.currentCell)) {
      
      this.registerCell(this.currentCell)

      let next = this.findNext(this.currentCell);
      
      if(!next) {
        return false;
      }
      else {
        this.currentCell = next;
      }
      noLoop++;
      if(noLoop >= maxLoop) {
        console.log('maxLoop');
        return false;
      }
    }
    this.registerCell(this.currentCell)

    return true;
  }


  registerCell(cell) {
    cell.isPath(true);
    cell.addCssClass(this.cssClass)
    this.cells[cell.getKey()] = cell;
    this.path.push(cell);
    this.currentIndex++;
  }

  cell(x,y) {
    if(typeof(this.cells[x+'-'+y]) !== 'undefined') {
      return typeof(this.cells[x+'-'+y]);
    }
    return false;
  }



  findNext(currentCell) {

    let x = currentCell.getX();
    let y = currentCell.getY();

    let possibleCells = [];


    if(this.isCellValid(x-1, y)) {
      let cell = this.labyrinth.cell(x-1, y);
      if(cell.getX() == this.end.getX() && cell.getY() == this.end.getY()) {
        return cell;
      }
      possibleCells.push(cell);
    }

    if(this.isCellValid(x+1, y)) {
      let cell = this.labyrinth.cell(x+1, y);
      if(cell.getX() == this.end.getX() && cell.getY() == this.end.getY()) {
        return cell;
      }
      possibleCells.push(cell);
    }

    if(this.isCellValid(x, y-1)) {
      let cell = this.labyrinth.cell(x, y-1);
      if(cell.getX() == this.end.getX() && cell.getY() == this.end.getY()) {
        cell.addCssClass('to-top')
        return cell;
      }
      possibleCells.push(cell);
    }

    if(this.isCellValid(x, y+1)) {
      let cell = this.labyrinth.cell(x, y+1);
      if(cell.getX() == this.end.getX() && cell.getY() == this.end.getY()) {
        cell.addCssClass('to-bottom')
        return cell;
      }
      possibleCells.push(cell);
    }

    possibleCells = this.shuffle(possibleCells);

    if(possibleCells.length) {
      return possibleCells[0];
    }
    else {
      return false;
    }
  }



  closest(target) {
    let closest = null;
    let minDistance = this.labyrinth.getHeight() * this.labyrinth.getWidth();

    for(let cell of this.path) {
      let distance =
      Math.sqrt(
        Math.pow(Math.abs(cell.getX() - target.getX()),2) +
        Math.pow(Math.abs(cell.getY() - target.getY()),2)
      );

      if(distance < minDistance) {
        minDistance = distance;
        closest = cell;
      }
    }

    return closest;
  }

  farest(target) {
    let farest = null;
    let maxDistance = 0;

    for(let cell of this.path) {
      let distance =
      Math.sqrt(
        Math.pow(Math.abs(cell.getX() - target.getX()),2) +
        Math.pow(Math.abs(cell.getY() - target.getY()),2)
      );

      if(distance > maxDistance) {
        maxDistance = distance;
        farest = cell;
      }
    }

    return farest;
  }



  cellExists(x, y) {
    if(!this.labyrinth.cell(x, y)) {
      return false;
    }
    return true;
  }


  isCellValid(x, y) {
    if(!this.cellExists(x, y)) {
      return false;
    }

    const cell = this.labyrinth.cell(x, y);

    if(cell.isPath()) {
      return false;
    }

    if(this.cellSurroundedCount(x,y) > 1 ) {
      return false;
    }
    return true;
  }



  cellSurroundedCount(x, y) {
    let count = 0;
    
    let left = this.labyrinth.cell(x-1, y);
    if(left) {
      if(left.isPath()) {
        count++;
      }
    }

    let right = this.labyrinth.cell(x+1, y);
    if(right) {
      if(right.isPath()) {
        count++;
      }
    }

    let top = this.labyrinth.cell(x, y-1);
    if(top) {
      if(top.isPath()) {
        count++;
      }
    }

    let bottom = this.labyrinth.cell(x, y+1);
    if(bottom) {
      if(bottom.isPath()) {
        count++;
      }
    }

    return count;

  }

  

  finished(cell) {
    if(cell.getX() == this.end.getX() && cell.getY() == this.end.getY()) {
      return true;
    }
    return false;
  }


  getPath() {
    return this.path;
  }


  shuffle(array) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
  }
  
}