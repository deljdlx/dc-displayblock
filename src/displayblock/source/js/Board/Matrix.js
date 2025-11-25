/**
 * A grid-based scene that arranges items in a matrix pattern.
 * Supports optimization by merging adjacent cells into larger cuboids.
 * @class Matrix
 * @extends Free
 */
class Matrix extends Free {
  /**
   * Number of columns in the matrix.
   * @type {number}
   */
  width = 16;

  /**
   * Number of rows in the matrix.
   * @type {number}
   */
  height = 16;

  /**
   * Whether to use optimization when generating.
   * @type {boolean}
   * @private
   */
  _optimize = true;

  /**
   * The matrix data structure storing cell states.
   * @type {Object.<number, Object.<number, boolean|number>>}
   */
  matrix = {};

  /**
   * Creates a new Matrix instance.
   * @param {number} width - Number of columns.
   * @param {number} height - Number of rows.
   * @param {Viewport} viewport - The viewport this matrix belongs to.
   */
  constructor(width, height, viewport) {
    super(viewport);

    this.width = width;
    this.height = height;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (typeof this.matrix[x] === 'undefined') {
          this.matrix[x] = {};
        }
        this.matrix[x][y] = false;
      }
    }
  }

  /**
   * Gets or sets the optimization flag.
   * @param {boolean|null} [value=null] - If provided, sets the optimization flag.
   * @returns {Matrix|boolean} The current instance when setting, or the current value when getting.
   */
  optimize(value = null) {
    if (value !== null) {
      this._optimize = value;
      return this;
    }
    return this._optimize;
  }

  /**
   * Enables or disables a cell in the matrix.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @param {boolean|number} [value=true] - The value to set.
   */
  enable(x, y, value = true) {
    this.matrix[x][y] = value;
  }

  /**
   * Generates a background element for the matrix.
   */
  generateBackground() {
    this.background = document.createElement('div');
    this.background.classList.add('board-background');
    this.background.style.position = 'absolute';
    this.background.style.top = 0;
    this.background.style.left = 0;
    this.background.style.width = this.width * this.cellSize + this.unit;
    this.background.style.height = this.height * this.cellSize + this.unit;
    this.element.appendChild(this.background);
  }

  /**
   * Checks if a cell is enabled.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @returns {boolean|number} The cell state.
   */
  enabled(x, y) {
    if (typeof this.matrix[x] !== 'undefined') {
      if (typeof this.matrix[x][y] !== 'undefined') {
        return this.matrix[x][y];
      }
    }
    return false;
  }

  /**
   * Generates the matrix with optimization (merging adjacent cells).
   * @param {HTMLElement} container - The container element.
   */
  generateOptimized(container) {
    this.generateBackground();

    // Row optimization - merge horizontal segments
    for (let y = 0; y < this.height; y++) {
      let left = null;
      let top = null;
      let segmentLength = 0;

      for (let x = 0; x < this.width; x++) {
        if (this.enabled(x, y)) {
          segmentLength++;
          if (left === null) {
            left = x * parseInt(this.cellSize);
          }
          if (segmentLength > 1) {
            this.enable(x, y, 2);
            this.enable(x - 1, y, 2);
          }
        } else {
          if (left !== null && segmentLength > 1) {
            top = y * parseInt(this.cellSize);
            const width = segmentLength * this.cellSize;
            const cube = new Cuboid(width, this.cellSize, this.cellSize);
            this.viewport.addItem(cube, left, top, this.cellSize);
          }
          segmentLength = 0;
          left = null;
        }
      }

      if (left !== null && segmentLength > 1) {
        top = y * parseInt(this.cellSize);
        const width = segmentLength * this.cellSize;
        const cube = new Cuboid(width, this.cellSize, this.cellSize);
        this.viewport.addItem(cube, left, top, this.cellSize);
        segmentLength = 0;
        left = null;
      }
    }

    // Column optimization - merge vertical segments
    for (let x = 0; x < this.width; x++) {
      let top = null;
      let segmentLength = 0;

      for (let y = 0; y < this.height; y++) {
        if (this.enabled(x, y) !== false && this.enabled(x, y) !== 2) {
          if (top === null) {
            top = y * parseInt(this.cellSize);
          }
          segmentLength++;
        } else {
          if (top !== null) {
            const left = x * this.cellSize;
            const height = segmentLength * this.cellSize;
            const cube = new Cuboid(this.cellSize, height, this.cellSize);
            this.viewport.addItem(cube, left, top, this.cellSize);
          }
          segmentLength = 0;
          top = null;
        }
      }

      if (top !== null) {
        const left = x * this.cellSize;
        const height = segmentLength * this.cellSize;
        const cube = new Cuboid(this.cellSize, height, this.cellSize);
        this.viewport.addItem(cube, left, top, this.cellSize);
        segmentLength = 0;
        top = null;
      }
    }

    const scene = this.viewport.getScene();
    scene.style.width = this.getOffsetWidth() + 'px';
    scene.style.height = this.getOffsetHeight() + 'px';

    this.generateBorders();
    this.generateAxes();

    super.generate(container);
  }

  /**
   * Generates the matrix content.
   * @param {HTMLElement} container - The container element.
   * @returns {Matrix|void} The current instance when not optimized.
   */
  generate(container) {
    if (this.optimize()) {
      return this.generateOptimized(container);
    }

    this.generateBackground();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.enabled(x, y)) {
          const left = x * parseInt(this.cellSize);
          const cube = new Cube(this.cellSize, 100);
          cube.setTopContent(x + ':' + y);
          const top = y * parseInt(this.cellSize);
          this.viewport.addItem(cube, left, top, this.cellSize);
        }
      }
    }

    const scene = this.viewport.getScene();
    scene.style.width = this.getOffsetWidth() + 'px';
    scene.style.height = this.getOffsetHeight() + 'px';

    this.generateBorders();
    this.generateAxes();

    super.generate(container);
    return this;
  }

  /**
   * Gets the total width of the matrix in pixels.
   * @returns {number} The width.
   */
  getOffsetWidth() {
    return this.width * this.cellSize;
  }

  /**
   * Gets the total height of the matrix in pixels.
   * @returns {number} The height.
   */
  getOffsetHeight() {
    return this.height * this.cellSize;
  }

  /**
   * Generates axis indicators for the matrix.
   */
  generateAxes() {
    const zAxe = new Cuboid(4, 4, 4000);
    zAxe.classList.add('axe');
    this.viewport.addItem(zAxe, this.getOffsetWidth() / 2, this.getOffsetHeight() / 2, 2000);

    const xAxe = new Cuboid(4000, 4, 4);
    xAxe.classList.add('axe');
    this.viewport.addItem(xAxe, -2000 + this.getOffsetWidth() / 2, this.getOffsetHeight() / 2, 0);

    const yAxe = new Cuboid(4, 4000, 4);
    yAxe.classList.add('axe');
    this.viewport.addItem(yAxe, this.getOffsetWidth() / 2, -2000 + this.getOffsetHeight() / 2, 0);
  }

  /**
   * Generates border cuboids around the matrix.
   */
  generateBorders() {
    const heightMultiplicator = 0.5;
    const sideWeight = 0.5;

    const topSide = new Cuboid(
      this.cellSize * this.width,
      this.cellSize * sideWeight,
      this.cellSize * heightMultiplicator
    );
    let top = -1 * parseInt(this.cellSize * sideWeight);
    topSide.classList.add('matrix-border');
    this.viewport.addItem(topSide, 0, top, this.cellSize * heightMultiplicator);

    const bottomSide = new Cuboid(
      this.cellSize * this.width,
      this.cellSize * sideWeight,
      this.cellSize * heightMultiplicator
    );
    top = this.height * parseInt(this.cellSize);
    bottomSide.classList.add('matrix-border');
    this.viewport.addItem(bottomSide, 0, top, this.cellSize * heightMultiplicator);

    const leftSide = new Cuboid(
      this.cellSize * sideWeight,
      this.cellSize * (this.height + 1),
      this.cellSize * heightMultiplicator
    );
    top = -1 * parseInt(this.cellSize) * sideWeight;
    leftSide.classList.add('matrix-border');
    this.viewport.addItem(leftSide, this.cellSize * -1 * sideWeight, top, this.cellSize * heightMultiplicator);

    const rightSide = new Cuboid(
      this.cellSize * sideWeight,
      this.cellSize * (this.height + 1),
      this.cellSize * heightMultiplicator
    );
    top = -1 * parseInt(this.cellSize) * sideWeight;
    rightSide.classList.add('matrix-border');
    this.viewport.addItem(rightSide, this.width * this.cellSize, top, this.cellSize * heightMultiplicator);
  }

  /**
   * Generates player elements in their respective cells.
   */
  generatePlayers() {
    for (const id in this.players) {
      const player = this.players[id].player;
      const cell = this.players[id].cell;

      this.getCellByIndex(cell).addElement(player.getElement());
    }
  }
}
