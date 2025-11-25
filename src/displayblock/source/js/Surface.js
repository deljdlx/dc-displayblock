/**
 * Represents a flat 2D surface in 3D space.
 * @class Surface
 * @extends Item
 */
class Surface extends Item {
  /**
   * Width of the surface.
   * @type {number}
   */
  width = 100;

  /**
   * Height of the surface.
   * @type {number}
   */
  height = 100;

  /**
   * Content to display on the surface.
   * @type {string}
   */
  topContent = '';

  /**
   * Creates a new Surface instance.
   * @param {number} [width] - Width of the surface.
   * @param {number} [height] - Height of the surface.
   */
  constructor(width, height) {
    super();

    if (typeof width !== 'undefined' && width !== null) {
      this.width = width;
    }

    if (typeof height !== 'undefined' && height !== null) {
      this.height = height;
    }

    this._element.classList.add('surface');
    this._element.style.width = this.width + this.unit;
    this._element.style.height = this.height + this.unit;
    this.content = null;
  }

  /**
   * Sets the content to display on the surface.
   * @param {string} content - The HTML content.
   */
  setContent(content) {
    this.content = content;
  }

  /**
   * Centers the transform origin based on surface dimensions.
   */
  centerOrigin() {
    this.originX = Math.floor(this.width / -2);
    this.originY = Math.floor(this.height / -2);
    this.originZ = Math.floor(this.depth / 2);

    this.wrapper.style.transformOrigin =
      Math.floor(this.width / 2) + 'px ' +
      Math.floor(this.height / 2) + 'px ' +
      this.depth / -2 + 'px ';
  }

  /**
   * Sets the width and redraws.
   * @param {number} width - The new width.
   */
  setWidth(width) {
    this.width = width;
    this.draw();
  }

  /**
   * Sets the height and redraws.
   * @param {number} height - The new height.
   */
  setHeight(height) {
    this.height = height;
    this.draw();
  }

  /**
   * Gets the top content element.
   * @returns {HTMLElement|undefined} The top content element.
   */
  getTopContentElement() {
    return this.topContentElement;
  }

  /**
   * Draws the surface by applying CSS transforms.
   */
  draw() {
    super.draw();

    this._element.style.width = this.width + this.unit;
    this._element.style.height = this.depth + this.unit;
    this._element.style.transform = 'translateZ(' + this.depth * -1 + this.unit + ') rotateX(90deg)';
    this._element.innerHTML = this.content;
  }

  /**
   * Generates the surface element.
   */
  generate() {
    this.wrapper.style.width = this.width + this.unit;
    this.wrapper.style.height = this.height + this.unit;

    this._element = document.createElement('div');
    this._element.classList.add('surface');
  }
}
