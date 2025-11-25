/**
 * The main viewport class that manages the 3D rendering canvas.
 * Contains scenes and provides methods for adding items and controlling the view.
 * @class Viewport
 * @extends Animable
 */
class Viewport extends Animable {
  /**
   * Whether to use centered origin for items.
   * @type {boolean}
   * @private
   */
  _centerOrigin = false;

  /**
   * The main container element.
   * @type {HTMLElement}
   * @private
   */
  _container = null;

  /**
   * The layout element.
   * @type {HTMLElement}
   * @private
   */
  _layout = null;

  /**
   * The perspective element for 3D transforms.
   * @type {HTMLElement}
   * @private
   */
  _perspective = null;

  /**
   * Collection of scenes, keyed by name.
   * @type {Object.<string, Scene>}
   * @private
   */
  _scenes = {};

  /**
   * Array of all items in the viewport.
   * @type {Item[]}
   * @private
   */
  _items = [];

  /**
   * State manager for import/export functionality.
   * @type {State}
   * @private
   */
  _state = null;

  /**
   * Creates a new Viewport instance.
   * @param {HTMLElement} container - The container element to render into.
   */
  constructor(container) {
    super();

    this._container = container;

    this._layout = this.getElement();
    this._layout.classList.add('layout');

    this._container.appendChild(this._layout);

    this._perspective = this.getWrapper();
    this._perspective.classList.add('perspective', 'layout__perspective');

    this._layout.appendChild(this._perspective);

    this.createScene('default');

    this._interactionManager = new ViewportInteraction(this);
    this._interactionManager.makeInteractive();

    this._state = new State(this);
  }

  /**
   * Creates a new scene with the given name.
   * @param {string} name - The name for the new scene.
   * @returns {Viewport} The current instance for method chaining.
   */
  createScene(name) {
    this.addScene(name, new Free(this));
    this.getScene(name).setContainer(this._perspective);
    this.getScene(name).generate();
    return this;
  }

  /**
   * Adds an existing scene to the viewport.
   * @param {string} name - The name for the scene.
   * @param {Scene} scene - The scene to add.
   * @returns {Viewport} The current instance for method chaining.
   */
  addScene(name, scene) {
    this._scenes[name] = scene;
    scene.setViewport(this);
    scene.setName(name);
    return this;
  }

  /**
   * Adds an item to a scene at the specified position.
   * @param {Item} item - The item to add.
   * @param {number} x - The X coordinate.
   * @param {number} y - The Y coordinate.
   * @param {number} z - The Z coordinate.
   * @param {boolean} [centered=false] - Whether to center the item.
   * @param {string} [scene='default'] - The name of the scene to add to.
   */
  addItem(item, x, y, z, centered = false, scene = 'default') {
    this._items.push(item);

    if (typeof this._scenes[scene] === 'undefined') {
      this.createScene(scene);
    }

    if (this._centerOrigin || centered) {
      this._scenes[scene].addItem(
        item,
        x + this.getWidth() / 2,
        y + this.getHeight() / 2,
        z
      );
    } else {
      this._scenes[scene].addItem(item, x, y, z);
    }
    this._scenes[scene].refresh();
  }

  /**
   * Draws the viewport and all its scenes.
   */
  draw() {
    this._container.appendChild(this._layout);

    for (const name in this._scenes) {
      const scene = this._scenes[name];
      scene.generate();
    }

    this.applyTransformations();
  }

  /**
   * Gets the width of the layout element.
   * @returns {number} The width in pixels.
   */
  getWidth() {
    return this._layout.offsetWidth;
  }

  /**
   * Gets the height of the layout element.
   * @returns {number} The height in pixels.
   */
  getHeight() {
    return this._layout.offsetHeight;
  }

  /**
   * Adds X, Y, and Z axis indicators to the viewport.
   */
  addAxes() {
    const x = 0;
    const y = 0;
    const z = 0;

    const xAxis = new Cuboid(2000, 3, 3);
    xAxis.addClass('axis');
    this.addItem(xAxis, -1000 + x + this.getWidth() / 2, y + this.getHeight() / 2, z);

    const yAxis = new Cuboid(3, 2000, 3);
    yAxis.addClass('axis');
    this.addItem(yAxis, x + this.getWidth() / 2, -1000 + y + this.getHeight() / 2, z);

    const zAxis = new Cuboid(3, 3, 2000);
    zAxis.addClass('axis');
    this.addItem(zAxis, x + this.getWidth() / 2, y + this.getHeight() / 2, -1000 + z);
  }

  /**
   * Gets a scene by name.
   * @param {string} [name='default'] - The name of the scene to get.
   * @returns {Scene|false} The scene, or false if not found.
   */
  getScene(name = 'default') {
    if (typeof this._scenes[name] !== 'undefined') {
      return this._scenes[name];
    }
    return false;
  }

  /**
   * Gets the state manager instance.
   * @returns {State} The state manager.
   */
  getState() {
    return this._state;
  }

  /**
   * Exports the current viewport state as a JSON-serializable object.
   * @returns {Object} The complete state object.
   */
  exportState() {
    return this._state.export();
  }

  /**
   * Exports the current viewport state as a JSON string.
   * @returns {string} The state as a JSON string.
   */
  toJSON() {
    return this._state.toJSON();
  }

  /**
   * Imports state from a JSON-serializable object.
   * Clears the current state before importing.
   * @param {Object} state - The state object to import.
   * @returns {Viewport} The current instance for method chaining.
   */
  importState(state) {
    this._state.clear();
    this._state.import(state);
    this.draw();
    return this;
  }

  /**
   * Imports state from a JSON string.
   * Clears the current state before importing.
   * @param {string} json - The JSON string to import.
   * @returns {Viewport} The current instance for method chaining.
   */
  fromJSON(json) {
    this._state.clear();
    this._state.fromJSON(json);
    this.draw();
    return this;
  }

  /**
   * Clears all scenes and items from the viewport.
   * @returns {Viewport} The current instance for method chaining.
   */
  clear() {
    this._state.clear();
    return this;
  }
}
