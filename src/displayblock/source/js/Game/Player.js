/**
 * Represents a player in the game with a visual avatar.
 * @class Player
 */
class Player {
  /**
   * Creates a new Player instance.
   * @param {string} id - Unique identifier for the player.
   */
  constructor(id) {
    this.unit = 'px';
    this.id = id;
    this.height = 50;
    this.image = null;

    this.cube = new Cube(this.height, this.height);
    this.generateElement();
  }

  /**
   * Sets the player's avatar image.
   * @param {string} image - URL of the avatar image.
   */
  setImage(image) {
    this.image = image;
    this.avatarElement.style.backgroundImage = 'url(' + image + ')';
  }

  /**
   * Gets the player's unique identifier.
   * @returns {string} The player ID.
   */
  getId() {
    return this.id;
  }

  /**
   * Gets the player's DOM element.
   * @returns {HTMLElement} The DOM element.
   */
  getElement() {
    return this.element;
  }

  /**
   * Generates the player's visual elements.
   * @returns {HTMLElement|void} The element when using the alternate method.
   */
  generateElement() {
    this.cube.generate();
    this.element = this.cube.getElement();
    this.cube.addClass('player');

    this.avatarElement = document.createElement('div');
    this.avatarElement.classList.add('player-side-avatar', 'player-side');
    this.avatarElement.style.transform = `
      translateZ(${this.height * 1.5}${this.unit})
      translateY(${this.height / 2}${this.unit})
      translateX(${this.height / 2}${this.unit})
      rotateX(-90deg)
      rotateY(45deg)`;
    this.element.appendChild(this.avatarElement);
  }
}
