
class Transformation
{

  get3DTransformations(element) {

    const style = getComputedStyle(element);
    let transform = style.transform.replace(/matrix3d\((.*?)\)/, '$1');

    let transformations = transform.split(',').map((item, index) => {
      return Number(item.trim());
    });

    // console.log(transform);
    // console.log(transformations);

    // console.log(transformations);
    let i = 0;
    let line = '';
    let matrix = [];
    let row = [];
    for(let value of transformations) {

      if(i % 4 === 0 && i) {
        matrix.push(row)
        row = [];
      }

      //console.log(value);
      row.push(value);
      i++;
    }

    matrix.push(row);

    // console.table(matrix);

    // https://github.com/jsidea/jsidea/blob/master/ts/jsidea/geom/Matrix3D.ts
    let yRotation = Math.asin(transformations[8]) / Math.PI * 180;

    let zRotation;
    let xRotation;

    if (Math.abs(transformations[2]) < 0.99999) {
      xRotation = Math.atan2(-transformations[9], transformations[10]) / Math.PI * 180;
      zRotation = Math.atan2(-transformations[4], transformations[0]) / Math.PI * 180;
    }
    else {
      // ret.x = Math.atan2(m.m32, m.m22) * math.Number.RAD_TO_DEG;
      // ret.z = 0;
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
      rotateZ: yRotation,
    }
  }
}
