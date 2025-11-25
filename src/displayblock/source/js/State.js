/**
 * Manages the global state of the 3D scene for easy import/export.
 * Provides serialization and deserialization of viewport, scenes, and items.
 * @class State
 */
class State {
  /**
   * The viewport this state manager is attached to.
   * @type {Viewport|null}
   * @private
   */
  _viewport = null;

  /**
   * Creates a new State instance.
   * @param {Viewport|null} [viewport=null] - The viewport to manage state for.
   */
  constructor(viewport = null) {
    this._viewport = viewport;
  }

  /**
   * Sets the viewport for this state manager.
   * @param {Viewport} viewport - The viewport to manage.
   * @returns {State} The current instance for method chaining.
   */
  setViewport(viewport) {
    this._viewport = viewport;
    return this;
  }

  /**
   * Gets the viewport this state manager is attached to.
   * @returns {Viewport|null} The viewport.
   */
  getViewport() {
    return this._viewport;
  }

  /**
   * Exports the current state as a JSON-serializable object.
   * @returns {Object} The complete state object.
   */
  export() {
    if (!this._viewport) {
      return null;
    }

    const state = {
      viewport: this._exportViewport(),
      scenes: this._exportScenes(),
    };

    return state;
  }

  /**
   * Exports the current state as a JSON string.
   * @returns {string} The state as a JSON string.
   */
  toJSON() {
    return JSON.stringify(this.export(), null, 2);
  }

  /**
   * Imports state from a JSON-serializable object.
   * @param {Object} state - The state object to import.
   * @param {HTMLElement} [container=null] - The container element for the viewport.
   * @returns {Viewport|null} The recreated viewport.
   */
  import(state, container = null) {
    if (!state) {
      return null;
    }

    // If a container is provided, create a new viewport
    if (container && state.viewport) {
      this._viewport = new Viewport(container);
    }

    if (!this._viewport) {
      return null;
    }

    // Import viewport state
    if (state.viewport) {
      this._importViewport(state.viewport);
    }

    // Import scenes and items
    if (state.scenes) {
      this._importScenes(state.scenes);
    }

    return this._viewport;
  }

  /**
   * Imports state from a JSON string.
   * @param {string} json - The JSON string to import.
   * @param {HTMLElement} [container=null] - The container element for the viewport.
   * @returns {Viewport|null} The recreated viewport.
   */
  fromJSON(json, container = null) {
    try {
      const state = JSON.parse(json);
      return this.import(state, container);
    } catch (error) {
      console.error('Failed to parse state JSON:', error);
      return null;
    }
  }

  /**
   * Exports viewport configuration.
   * @returns {Object} The viewport state.
   * @private
   */
  _exportViewport() {
    return {
      width: this._viewport.getWidth(),
      height: this._viewport.getHeight(),
      position: this._viewport.getPositions(),
      rotation: this._viewport.getRotations(),
    };
  }

  /**
   * Exports all scenes and their items.
   * @returns {Object} The scenes state.
   * @private
   */
  _exportScenes() {
    const scenes = {};
    const viewportScenes = this._viewport._scenes;

    for (const name in viewportScenes) {
      const scene = viewportScenes[name];
      scenes[name] = this._exportScene(scene);
    }

    return scenes;
  }

  /**
   * Exports a single scene.
   * @param {Scene} scene - The scene to export.
   * @returns {Object} The scene state.
   * @private
   */
  _exportScene(scene) {
    return {
      name: scene.getName(),
      position: scene.getPositions(),
      rotation: scene.getRotations(),
      items: this._exportItems(scene),
    };
  }

  /**
   * Exports all items from a scene.
   * @param {Scene} scene - The scene to export items from.
   * @returns {Array} Array of item states.
   * @private
   */
  _exportItems(scene) {
    const items = [];

    for (const id in scene.items) {
      const itemData = scene.items[id];
      const item = itemData.item;

      items.push(this._exportItem(item, itemData));
    }

    return items;
  }

  /**
   * Exports a single item.
   * @param {Item} item - The item to export.
   * @param {Object} itemData - The item data from the scene.
   * @returns {Object} The item state.
   * @private
   */
  _exportItem(item, itemData) {
    const exported = {
      id: item.getId(),
      type: this._getItemType(item),
      position: {
        x: itemData.x,
        y: itemData.y,
        z: itemData.z,
      },
      rotation: item.getRotations(),
      data: item.getData(),
    };

    // Add type-specific properties
    if (item instanceof Cuboid) {
      exported.dimensions = {
        width: item.width,
        height: item.height,
        depth: item.depth,
      };
      if (item.topContent) {
        exported.topContent = item.topContent;
      }
      if (item.frontContent) {
        exported.frontContent = item.frontContent;
      }
    }

    if (item instanceof Line) {
      exported.weight = item._weight;
      exported.color = item._color;
      exported.start = { ...item._start };
      exported.end = { ...item._end };
    }

    if (item instanceof Surface) {
      exported.dimensions = {
        width: item.width,
        height: item.height,
      };
      if (item.content) {
        exported.content = item.content;
      }
    }

    return exported;
  }

  /**
   * Gets the type name of an item for serialization.
   * @param {Item} item - The item to identify.
   * @returns {string} The type name.
   * @private
   */
  _getItemType(item) {
    if (item instanceof Cube) {
      return 'Cube';
    }
    if (item instanceof Cuboid) {
      return 'Cuboid';
    }
    if (item instanceof Line) {
      return 'Line';
    }
    if (item instanceof Surface) {
      return 'Surface';
    }
    return 'Item';
  }

  /**
   * Imports viewport configuration.
   * @param {Object} viewportState - The viewport state to import.
   * @private
   */
  _importViewport(viewportState) {
    if (viewportState.position) {
      this._viewport.setPositions(
        viewportState.position.x,
        viewportState.position.y,
        viewportState.position.z
      );
    }

    if (viewportState.rotation) {
      this._viewport.setRotations(
        viewportState.rotation.x,
        viewportState.rotation.y,
        viewportState.rotation.z
      );
    }

    this._viewport.applyTransformations();
  }

  /**
   * Imports scenes and their items.
   * @param {Object} scenesState - The scenes state to import.
   * @private
   */
  _importScenes(scenesState) {
    for (const name in scenesState) {
      // Skip the default scene as it's already created
      if (name !== 'default') {
        this._viewport.createScene(name);
      }

      const sceneState = scenesState[name];
      this._importScene(name, sceneState);
    }
  }

  /**
   * Imports a single scene.
   * @param {string} name - The scene name.
   * @param {Object} sceneState - The scene state to import.
   * @private
   */
  _importScene(name, sceneState) {
    const scene = this._viewport.getScene(name);

    if (sceneState.position) {
      scene.setPositions(
        sceneState.position.x,
        sceneState.position.y,
        sceneState.position.z
      );
    }

    if (sceneState.rotation) {
      scene.setRotations(
        sceneState.rotation.x,
        sceneState.rotation.y,
        sceneState.rotation.z
      );
    }

    // Import items
    if (sceneState.items) {
      for (const itemState of sceneState.items) {
        this._importItem(itemState, name);
      }
    }

    scene.applyTransformations();
  }

  /**
   * Imports a single item into a scene.
   * @param {Object} itemState - The item state to import.
   * @param {string} sceneName - The name of the scene to add the item to.
   * @private
   */
  _importItem(itemState, sceneName) {
    let item = null;

    switch (itemState.type) {
      case 'Cube':
        item = new Cube(
          itemState.dimensions.width,
          itemState.dimensions.depth
        );
        break;

      case 'Cuboid':
        item = new Cuboid(
          itemState.dimensions.width,
          itemState.dimensions.height,
          itemState.dimensions.depth
        );
        break;

      case 'Line':
        item = new Line(itemState.weight, itemState.color);
        if (itemState.start) {
          item.setStart(itemState.start.x, itemState.start.y, itemState.start.z);
        }
        if (itemState.end) {
          item.setEnd(itemState.end.x, itemState.end.y, itemState.end.z);
        }
        break;

      case 'Surface':
        item = new Surface(
          itemState.dimensions.width,
          itemState.dimensions.height
        );
        if (itemState.content) {
          item.setContent(itemState.content);
        }
        break;

      default:
        console.warn(`Unknown item type: ${itemState.type}`);
        return;
    }

    if (!item) {
      return;
    }

    // Set item ID
    if (itemState.id) {
      item.setId(itemState.id);
    }

    // Set rotation
    if (itemState.rotation) {
      item.setRotations(
        itemState.rotation.x,
        itemState.rotation.y,
        itemState.rotation.z
      );
    }

    // Set data
    if (itemState.data) {
      for (const key in itemState.data) {
        item.setData(key, itemState.data[key]);
      }
    }

    // Set content for Cuboid types
    if (item instanceof Cuboid) {
      if (itemState.topContent) {
        item.setTopContent(itemState.topContent);
      }
      if (itemState.frontContent) {
        item.setFrontContent(itemState.frontContent);
      }
    }

    // Add item to viewport
    this._viewport.addItem(
      item,
      itemState.position.x,
      itemState.position.y,
      itemState.position.z,
      false,
      sceneName
    );
  }

  /**
   * Clears all scenes and items from the viewport.
   * @returns {State} The current instance for method chaining.
   */
  clear() {
    if (!this._viewport) {
      return this;
    }

    for (const name in this._viewport._scenes) {
      const scene = this._viewport._scenes[name];
      scene.clear();
    }

    this._viewport._items = [];
    return this;
  }
}
