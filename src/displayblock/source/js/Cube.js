/**
 * Represents a 3D cube (equal-sided cuboid).
 * @class Cube
 * @extends Cuboid
 */
class Cube extends Cuboid {
  /**
   * Creates a new Cube instance.
   * @param {number} cellSize - The size of each side of the cube.
   * @param {number} [cellHeight] - The height of the cube (defaults to cellSize if not provided).
   */
  constructor(cellSize, cellHeight) {
    super(cellSize, cellSize, cellHeight);
    this.getElement().classList.add('cube');
  }
}
