/**
 * A game viewport that supports player management.
 * @class Game
 * @extends Viewport
 */
class Game extends Viewport {
  /**
   * Creates a new Game instance.
   * @param {number} width - Width of the game viewport.
   * @param {number} height - Height of the game viewport.
   * @param {HTMLElement} container - The container element.
   */
  constructor(width, height, container) {
    super(width, height, container);
    this.players = {};
  }

  /**
   * Adds a player to the game at the specified cell.
   * @param {Player} player - The player to add.
   * @param {number} cell - The cell index to place the player.
   */
  addPlayer(player, cell) {
    this.players[player.getId()] = player;
    this.board.addItem(player, cell);
  }
}
