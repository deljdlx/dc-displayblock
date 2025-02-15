class Board
{


  items = {};
  cellSize = 100;

  constructor(viewport)
  {

    this.viewport = viewport;

    this.unit = 'px';

    this.cells = {};
    this.container = null;
    this.element = document.createElement('div');
    this.element.classList.add('board');
  }


  getElement() {
    return this.element;
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  getCellByIndex(index) {
    return this.cells[index];
  }


  addItem(item, x, y, z) {

    this.items[item.getId()] = {
      x: x,
      y: y,
      z: z,
      item: item
    };
  }


  setCellSize(cellSize) {
      this.cellSize = cellSize;
  }


  getCellSize() {
      return this.cellSize;
  }

  getElement() {
      return this.element;
  }




  randomize() {
    for(let i in this.cells) {
      this.cells[i].randomizeTopColor();
    }
  }
  
}


