/**
 * Represents a cell in a board, containing a cube.
 * @class Cell
 */
class Cell {
  /**
   * Creates a new Cell instance.
   * @param {Scene} board - The board this cell belongs to.
   * @param {number} cellSize - The size of the cell.
   * @param {number} cellHeight - The height of the cell's cube.
   */
  constructor(board, cellSize, cellHeight) {
    this.unit = 'px';

    this.board = board;
    this.container = board.getElement();

    this.cube = new Cube(cellSize, cellHeight);

    this.left = 0;
    this.top = 0;

    this.elements = [];
  }

  /**
   * Gets the cube contained in this cell.
   * @returns {Cube} The cube.
   */
  getCube() {
    return this.cube;
  }

  /**
   * Adds a CSS class to the cell's cube.
   * @param {string} cssClass - The CSS class name to add.
   */
  addClass(cssClass) {
    this.cube.addClass(cssClass);
  }

  /**
   * Gets the DOM element of the cell's cube.
   * @returns {HTMLElement} The DOM element.
   */
  getElement() {
    return this.cube.getElement();
  }

  /**
   * Generates and positions the cell.
   * @param {number} left - The left position.
   * @param {number} top - The top position.
   * @returns {Cell} The current instance for method chaining.
   */
  generate(left, top) {
    this.cube.generate(left, top);
    this.container.appendChild(this.cube.getElement());
    return this;
  }

  /**
   * Adds a child element to the cell's cube.
   * @param {HTMLElement} element - The element to add.
   * @returns {void}
   */
  addElement(element) {
    this.cube.addElement(element);
  }

  /**
   * Randomizes the top face color of the cell's cube.
   * @returns {void}
   */
  randomizeTopColor() {
    this.cube.randomizeTopColor();
  }
}
