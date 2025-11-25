/**
 * Base class for renderable 3D elements that can be displayed in the DOM.
 * Extends PositionManager to add rendering capabilities.
 * @class Renderable
 * @extends PositionManager
 */
class Renderable extends PositionManager {
  /**
   * The main DOM element for this renderable.
   * @type {HTMLElement}
   * @protected
   */
  _element;

  /**
   * The wrapper DOM element that contains the main element.
   * @type {HTMLElement}
   * @protected
   */
  _wrapper;

  /**
   * Whether this element has been rendered.
   * @type {boolean}
   * @protected
   */
  _rendered = false;

  /**
   * List of CSS classes applied to the element.
   * @type {DOMTokenList}
   * @protected
   */
  _classList;

  /**
   * CSS transform-origin value for the element.
   * @type {string}
   * @protected
   */
  _transformOrigin = '50% 50%';

  /**
   * Array of Line objects connected to this element.
   * @type {Line[]}
   * @protected
   */
  _connections = [];

  /**
   * Origin offsets for positioning.
   * @type {{x: number, y: number, z: number}}
   * @protected
   */
  _origins = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Creates a new Renderable instance.
   */
  constructor() {
    super();
    this._element = document.createElement('div');
    this._element.classList.add('item');
    this._classList = this._element.classList;

    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('item-wrapper');
    this._wrapper.manager = this;
    this._wrapper.appendChild(this._element);
  }

  /**
   * Centers the transform origin based on element dimensions.
   */
  centerOrigin() {
    this._origins.x = Math.floor(this.width / -2);
    this._origins.y = Math.floor(this.height / -2);
    this._origins.z = Math.floor(this.depth / -2);

    this.getWrapper().style.transformOrigin =
      Math.floor(this.width / -2) + 'px ' +
      Math.floor(this.height / -2) + 'px ' +
      (this.depth / -2) + 'px ';
  }

  /**
   * Adds a line connection to this element.
   * @param {Line} line - The line to connect.
   * @returns {Renderable} The current instance for method chaining.
   */
  addConnection(line) {
    this._connections.push(line);
    return this;
  }

  /**
   * Sets the CSS transform-origin value.
   * @param {string} value - The transform-origin value (e.g., '50% 50%' or '0 0').
   * @returns {Renderable} The current instance for method chaining.
   */
  setTranformOrigin(value) {
    this._transformOrigin = value;
    return this;
  }

  /**
   * Renders the element by applying CSS transforms.
   * @returns {Renderable} The current instance for method chaining.
   */
  draw() {
    this.getWrapper().style.transformOrigin = this._transformOrigin;

    this.getWrapper().style.transform = `
      translateX(${this.getX() + this._origins.x}${this.unit})
      translateY(${this.getY() + this._origins.y}${this.unit})
      translateZ(${this.getZ() + this._origins.z}${this.unit})

      rotateX(${this.getRotation('x')}${this.rotationUnit})
      rotateY(${this.getRotation('y')}${this.rotationUnit})
      rotateZ(${this.getRotation('z')}${this.rotationUnit})
    `;
    this._rendered = true;
    return this;
  }

  /**
   * Applies current transformations to the wrapper element.
   */
  applyTransformations() {
    this.getWrapper().style.transform = `
      translateX(${this.getX() + this._origins.x}${this.unit})
      translateY(${this.getY() + this._origins.y}${this.unit})
      translateZ(${this.getZ() + this._origins.z}${this.unit})
      rotateX(${this.getRotation('x')}deg)
      rotateY(${this.getRotation('y')}deg)
      rotateZ(${this.getRotation('z')}deg)
    `;
  }

  /**
   * Gets the wrapper element.
   * @returns {HTMLElement} The wrapper DOM element.
   */
  getWrapper() {
    return this._wrapper;
  }

  /**
   * Gets the main element.
   * @returns {HTMLElement} The main DOM element.
   */
  getElement() {
    return this._element;
  }

  /**
   * Checks if this element has been rendered.
   * @returns {boolean} True if rendered, false otherwise.
   */
  isRendered() {
    return this._rendered;
  }

  /**
   * Adds a CSS class to the element.
   * @param {string} cssClass - The CSS class name to add.
   */
  addClass(cssClass) {
    this.getElement().classList.add(cssClass);
  }

  /**
   * Removes a CSS class from the element.
   * @param {string} cssClass - The CSS class name to remove.
   */
  removeClass(cssClass) {
    this.getElement().classList.remove(cssClass);
  }
}
