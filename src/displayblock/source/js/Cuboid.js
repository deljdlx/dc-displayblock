/**
 * Represents a 3D rectangular prism (cuboid) with six faces.
 * @class Cuboid
 * @extends Item
 */
class Cuboid extends Item {
  /**
   * Content to display on the top face.
   * @type {string}
   */
  topContent = '';

  /**
   * Content to display on the front face.
   * @type {string}
   */
  frontContent = '';

  /**
   * Creates a new Cuboid instance.
   * @param {number} [width=100] - Width of the cuboid.
   * @param {number} [height=100] - Height of the cuboid.
   * @param {number} [depth=100] - Depth of the cuboid.
   */
  constructor(width = 100, height = 100, depth = 100) {
    super();

    this.setDimensions(width, height, depth);

    this.getElement().classList.add('cuboid');
    this.getElement().style.width = this.width + this.unit;
    this.getElement().style.height = this.height + this.unit;
    this._buildSides();

    this.topContentElement = null;
    this.frontContentElement = null;
  }

  /**
   * Gets the depth of the cuboid.
   * @returns {number} The depth value.
   */
  getDepth() {
    return this.depth;
  }

  /**
   * Gets the center point of the cuboid in 3D space.
   * @returns {{x: number, y: number, z: number}} The center coordinates.
   */
  getCenter() {
    const itemInfo = this._board.getItemDescriptorById(this.getId());

    return {
      x: Math.round(itemInfo.item.getX() + this.width / 2),
      y: Math.round(itemInfo.item.getY() + this.height / 2),
      z: Math.round(itemInfo.item.getZ() + this.depth / 2),
    };
  }

  /**
   * Resizes the cuboid to new dimensions.
   * @param {number|null} [width=null] - New width, or null to keep current.
   * @param {number|null} [height=null] - New height, or null to keep current.
   * @param {number|null} [depth=null] - New depth, or null to keep current.
   * @returns {Cuboid} The current instance for method chaining.
   */
  resize(width = null, height = null, depth = null) {
    if (width === null) {
      width = this.width;
    }
    if (height === null) {
      height = this.height;
    }
    if (depth === null) {
      depth = this.depth;
    }

    this.setDimensions(width, height, depth);

    this._wrapper.style.width = this.width + this.unit;
    this._wrapper.style.height = this.height + this.unit;
    this.getElement().style.width = this.width + this.unit;
    this.getElement().style.height = this.height + this.unit;

    this.draw();
    this.applyTransformations();

    return this;
  }

  /**
   * Sets the dimensions of the cuboid.
   * @param {number} [width=100] - The width.
   * @param {number} [height=100] - The height.
   * @param {number} [depth=100] - The depth.
   * @returns {Cuboid} The current instance for method chaining.
   */
  setDimensions(width = 100, height = 100, depth = 100) {
    if (width !== null) {
      this.width = width;
    }
    if (height !== null) {
      this.height = height;
    }
    if (depth !== null) {
      this.depth = depth;
    }

    this._transformOrigin =
      Math.round(width * 0.5) + 'px ' +
      Math.round(height * 0.5) + 'px ' +
      Math.round(depth * 0.5) + 'px ';

    this.updateConnections();
    return this;
  }

  /**
   * Sets the content to display on the top face.
   * @param {string} content - The HTML content.
   */
  setTopContent(content) {
    this.topContent = content;
    if (this.topElement) {
      this.topElement.innerHTML = content;
    }
  }

  /**
   * Sets the content to display on the front face.
   * @param {string} content - The HTML content.
   */
  setFrontContent(content) {
    this.frontContent = content;
    if (this.frontElement) {
      this.frontElement.innerHTML = content;
    }
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
   * Sets the depth and redraws.
   * @param {number} depth - The new depth.
   */
  setDepth(depth) {
    this.depth = depth;
    this.draw();
  }

  /**
   * Gets the top content element.
   * @returns {HTMLElement|null} The top content element.
   */
  getTopContentElement() {
    return this.topContentElement;
  }

  /**
   * Gets the front side element.
   * @returns {HTMLElement} The front side element.
   */
  getFrontSide() {
    return this.frontElement;
  }

  /**
   * Draws the cuboid by applying CSS transforms to all faces.
   */
  draw() {
    super.draw();

    this.frontElement.style.width = this.width + this.unit;
    this.frontElement.style.height = this.height + this.unit;
    this.frontElement.style.transform = 'translateZ(' + this.depth + this.unit + ')';

    this.backElement.style.width = this.width + this.unit;
    this.backElement.style.height = this.height + this.unit;
    this.backElement.style.transform = 'rotateY(180deg) translateX(-' + this.width + this.unit + ')';

    this.topElement.style.width = this.width + this.unit;
    this.topElement.style.height = this.depth + this.unit;
    this.topElement.style.transform = 'rotateX(90deg)';
    this.topElement.innerHTML = this.topContent;

    this.rightElement.style.width = this.depth + this.unit;
    this.rightElement.style.height = this.height + this.unit;
    this.rightElement.style.transform = 'rotateY(-90deg)';

    this.leftElement.style.width = this.depth + this.unit;
    this.leftElement.style.height = this.height + this.unit;
    this.leftElement.style.transform = 'rotateY(90deg) translateX(-' + this.depth + this.unit + ')';

    this.bottomElement.style.width = this.width + this.unit;
    this.bottomElement.style.height = this.depth + this.unit;
    this.bottomElement.style.transform = 'rotateX(90deg)';
  }

  /**
   * Builds the six side elements of the cuboid.
   * @private
   */
  _buildSides() {
    this._wrapper.style.width = this.width + this.unit;
    this._wrapper.style.height = this.height + this.unit;

    this.frontElement = document.createElement('div');
    this.frontElement.classList.add('cuboid-side');
    this.frontElement.classList.add('cuboid-side-front');
    this.getElement().appendChild(this.frontElement);

    this.topElement = document.createElement('div');
    this.topElement.classList.add('cuboid-side');
    this.topElement.classList.add('cuboid-side-top');

    this.topContentElement = document.createElement('div');
    this.topContentElement.classList.add('side-top-content');
    this.topElement.appendChild(this.topContentElement);
    this.getElement().appendChild(this.topElement);

    this.bottomElement = document.createElement('div');
    this.bottomElement.classList.add('cuboid-side-bottom');
    this.bottomElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.bottomElement);

    this.backElement = document.createElement('div');
    this.backElement.classList.add('cuboid-side-back');
    this.backElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.backElement);

    this.rightElement = document.createElement('div');
    this.rightElement.classList.add('cuboid-side-right');
    this.rightElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.rightElement);

    this.leftElement = document.createElement('div');
    this.leftElement.classList.add('cuboid-side-left');
    this.leftElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.leftElement);
  }
}
