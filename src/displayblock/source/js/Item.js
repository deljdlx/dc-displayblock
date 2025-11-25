/**
 * Base class for all 3D items that can be added to a scene.
 * Extends Animable to provide animation capabilities.
 * @class Item
 * @extends Animable
 */
class Item extends Animable {
  /**
   * Unique identifier for this item.
   * @type {string}
   * @private
   */
  _id = null;

  /**
   * The board/scene this item belongs to.
   * @type {Scene}
   * @protected
   */
  _board;

  /**
   * Event listeners registered on this item.
   * @type {Object.<string, Function[]>}
   */
  listeners = {};

  /**
   * Custom data attached to this item.
   * @type {Object.<string, *>}
   */
  data = {};

  /**
   * Origin point for transformations.
   * @type {{x: number, y: number, z: number}}
   * @protected
   */
  _origin = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Creates a new Item instance.
   * @param {string|null} [id=null] - Optional unique identifier. If null, one is auto-generated.
   */
  constructor(id = null) {
    super();
    if (id === null) {
      this._id = 'item-' + Math.random() + '-' + new Date().getTime();
    }
  }

  /**
   * Sets the board/scene this item belongs to.
   * @param {Scene} board - The board to set.
   * @returns {Item} The current instance for method chaining.
   */
  setBoard(board) {
    this._board = board;
    return this;
  }

  /**
   * Gets the board/scene this item belongs to.
   * @returns {Scene} The board.
   */
  getBoard() {
    return this._board;
  }

  /**
   * Adds an event listener to this item's wrapper element.
   * @param {string} eventName - The event type (e.g., 'click', 'mouseover').
   * @param {Function} callback - The callback function to execute.
   * @returns {Item} The current instance for method chaining.
   */
  addEventListener(eventName, callback) {
    if (typeof this.listeners[eventName] === 'undefined') {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    this.getWrapper().addEventListener(eventName, callback);
    return this;
  }

  /**
   * Gets the unique identifier of this item.
   * @returns {string} The item's ID.
   */
  getId() {
    return this._id;
  }

  /**
   * Sets the unique identifier of this item.
   * @param {string} id - The new ID.
   * @returns {Item} The current instance for method chaining.
   */
  setId(id) {
    this._id = id;
    return this;
  }

  /**
   * Adds a CSS class to this item's element.
   * @param {string} cssClass - The CSS class name to add.
   */
  addClass(cssClass) {
    this._element.classList.add(cssClass);
  }

  /**
   * Removes a CSS class from this item's element.
   * @param {string} cssClass - The CSS class name to remove.
   */
  removeClass(cssClass) {
    this.getElement().classList.remove(cssClass);
  }

  /**
   * Sets a custom data value on this item.
   * @param {string} name - The data key.
   * @param {*} value - The data value.
   * @returns {Item} The current instance for method chaining.
   */
  setData(name, value) {
    this.data[name] = value;
    return this;
  }

  /**
   * Gets a custom data value from this item.
   * @param {string} [name] - The data key. If omitted, returns all data.
   * @returns {*} The data value, or null if not found.
   */
  getData(name) {
    if (name) {
      if (typeof this.data[name] !== 'undefined') {
        return this.data[name];
      }
      return null;
    }
    return this.data;
  }

  /**
   * Clears all custom data from this item.
   * @returns {Item} The current instance for method chaining.
   */
  clearData() {
    this.data = {};
    return this;
  }
}
