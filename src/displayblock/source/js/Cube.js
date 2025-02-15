class Cube extends Cuboid
{


  constructor(cellSize, cellHeight) {

    super(cellSize, cellSize, cellHeight);

    this.getElement().classList.add('cube');
  }


}
