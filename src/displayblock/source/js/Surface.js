class Surface extends Item
{


  width = 100;
  height = 100;

  topContent = '';


  constructor(width, height) {

    super();

    if(typeof(width) !== 'undefined' && width !== null) {
      this.width = width;
    }

    if(typeof(height) !== 'undefined' && height !== null) {
      this.height = height;
    }


    this._element.classList.add('surface');
    this._element.style.width = this.width + this.unit;
    this._element.style.height = this.height + this.unit;
    this.content = null;

  }


  setContent(content) {
    this.content = content;
  }

  centerOrigin() {
    this.originX = Math.floor(this.width / -2);
    this.originY = Math.floor(this.height / -2);
    this.originZ = Math.floor(this.depth / 2);

    this.wrapper.style.transformOrigin =
      Math.floor(this.width / 2) + 'px '
      + Math.floor(this.height / 2) + 'px '
      + (this.depth / -2 ) + 'px '
    ;

  }

  setWidth(width) {
    this.width = width;
    this.draw();
  }

  setHeight(height) {
    this.height = height;
    this.draw();
  }

  getTopContentElement()
  {
    return this.topContentElement;
  }

  draw() {
    super.draw();

    this._element.style.width = this.width + this.unit;
    this._element.style.height = this.depth + this.unit;
    this._element.style.transform = 'translateZ(' + (this.depth * -1) + this.unit + ') rotateX(90deg)';
    this._element.innerHTML = this.content;
  }



  generate() {

    this.wrapper.style.width = this.width + this.unit;
    this.wrapper.style.height = this.height + this.unit;


    this._element = document.createElement('div');
    this._element.classList.add('surface');

  }

}
