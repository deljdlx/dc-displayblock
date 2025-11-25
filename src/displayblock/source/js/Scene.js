/**
 * Represents a 3D scene that can contain multiple items.
 * Acts as a container for organizing and rendering 3D objects.
 * @class Scene
 * @extends Item
 */
class Scene extends Item {
  /**
   * The viewport this scene belongs to.
   * @type {Viewport}
   * @protected
   */
  _viewport;

  /**
   * The name identifier for this scene.
   * @type {string}
   * @private
   */
  _name = '';

  /**
   * Collection of items in this scene, keyed by item ID.
   * @type {Object.<string, {x: number, y: number, z: number, item: Item}>}
   */
  items = {};

  /**
   * Creates a new Scene instance.
   * @param {Viewport} viewport - The viewport this scene belongs to.
   */
  constructor(viewport) {
    super();
    this._viewport = viewport;
    this.container = null;

    this.getElement().classList.add('board');
    this.getElement().style.transformOrigin =
      this._viewport.getWidth() / 2 + 'px ' + this._viewport.getHeight() / 2 + 'px ';
  }

  /**
   * Sets the name of this scene.
   * @param {string} name - The scene name.
   * @returns {Scene} The current instance for method chaining.
   */
  setName(name) {
    this._name = name;
    this.getElement().dataset.name = name;
    return this;
  }

  /**
   * Gets the name of this scene.
   * @returns {string} The scene name.
   */
  getName() {
    return this._name;
  }

  /**
   * Sets the viewport for this scene.
   * @param {Viewport} viewport - The viewport to set.
   */
  setViewport(viewport) {
    this._viewport = viewport;
  }

  /**
   * Gets the viewport this scene belongs to.
   * @returns {Viewport} The viewport.
   */
  getViewport() {
    return this._viewport;
  }

  /**
   * Adds an item to this scene at the specified position.
   * @param {Item} item - The item to add.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @param {number} z - The Z coordinate.
   * @returns {Scene} The current instance for method chaining.
   */
  addItem(item, x, y, z) {
    item.setBoard(this);

    this.items[item.getId()] = {
      x: x,
      y: y,
      z: z,
      item: item,
    };

    item.draw();
    return this;
  }

  /**
   * Gets the item descriptor for an item by its ID.
   * @param {string} itemId - The item's ID.
   * @returns {{x: number, y: number, z: number, item: Item}|undefined} The item descriptor.
   */
  getItemDescriptorById(itemId) {
    return this.items[itemId];
  }

  /**
   * Sets the container element for this scene.
   * @param {HTMLElement} container - The container element.
   * @returns {Scene} The current instance for method chaining.
   */
  setContainer(container) {
    this.container = container;
    this.container.appendChild(this._element);
    return this;
  }

  /**
   * Generates the scene by refreshing all items.
   */
  generate() {
    this.refresh();
    this._rendered = true;
  }

  /**
   * Gets the wrapper element for this scene.
   * @returns {HTMLElement} The wrapper element.
   */
  getWrapper() {
    return this.getElement();
  }

  /**
   * Clears all items from this scene.
   * @returns {Scene} The current instance for method chaining.
   */
  clear() {
    this.items = {};
    this.getElement().innerHTML = '';
    return this;
  }

  /**
   * Refreshes all items in the scene by updating their positions and redrawing.
   */
  refresh() {
    for (const id in this.items) {
      const itemData = this.items[id];

      itemData.item.setPositions(itemData.x, itemData.y, itemData.z);

      const wrapper = itemData.item.getWrapper();
      this.getElement().appendChild(wrapper);
      itemData.item.draw();
    }
  }
}
