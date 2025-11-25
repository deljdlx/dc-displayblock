/**
 * Utility class for extracting 3D transformation values from CSS matrix3d transforms.
 * @class Transformation
 */
class Transformation {
  /**
   * Extracts 3D transformation values (translations and rotations) from an element's computed CSS transform.
   * @param {HTMLElement} element - The DOM element to extract transformations from.
   * @returns {{translateX: number, translateY: number, translateZ: number, rotateX: number, rotateY: number, rotateZ: number}} An object containing translation and rotation values.
   */
  get3DTransformations(element) {
    const style = getComputedStyle(element);
    const transform = style.transform.replace(/matrix3d\((.*?)\)/, '$1');

    const transformations = transform.split(',').map((item) => {
      return Number(item.trim());
    });

    const matrix = [];
    let row = [];

    for (let i = 0; i < transformations.length; i++) {
      if (i % 4 === 0 && i) {
        matrix.push(row);
        row = [];
      }
      row.push(transformations[i]);
    }
    matrix.push(row);

    // Reference: https://github.com/jsidea/jsidea/blob/master/ts/jsidea/geom/Matrix3D.ts
    const yRotation = Math.asin(transformations[8]) / Math.PI * 180;

    let zRotation = 0;
    let xRotation = 0;

    if (Math.abs(transformations[2]) < 0.99999) {
      xRotation = Math.atan2(-transformations[9], transformations[10]) / Math.PI * 180;
      zRotation = Math.atan2(-transformations[4], transformations[0]) / Math.PI * 180;
    }

    const xTranslation = transformations[12];
    const yTranslation = transformations[13];
    const zTranslation = transformations[14];

    return {
      translateX: xTranslation,
      translateY: yTranslation,
      translateZ: zTranslation,
      rotateX: xRotation,
      rotateY: yRotation,
      rotateZ: zRotation,
    };
  }
}
