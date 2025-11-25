/**
 * A free-form scene that allows items to be placed at any position.
 * @class Free
 * @extends Scene
 */
class Free extends Scene {
  /**
   * Generates a background element for the board.
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
}
