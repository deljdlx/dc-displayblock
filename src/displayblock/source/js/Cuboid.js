class Cuboid extends Item
{





  topContent = '';
  frontContent = '';


  constructor(width = 100, height = 100, depth = 100) {

    super();

    this.setDimensions(width, height, depth);

    this.getElement().classList.add('cuboid');
    this.getElement().style.width = this.width + this.unit;
    this.getElement().style.height = this.height + this.unit;
    this._buildSides();

    this.topContentElement = null;
    this.frontContentElement = null;
  }


  getDepth() {
    return this.depth;
  }

  getCenter() {

    const itemInfo = this._board.getItemDescriptorById(this.getId());

    return {
      x: Math.round(itemInfo.item.getX() + this.width / 2),
      y: Math.round(itemInfo.item.getY() + this.height / 2) ,
      z: Math.round(itemInfo.item.getZ() + this.depth / 2),
    };
  }

  resize(width = null, height = null, depth = null) {

    if(width === null) { width = this.width; }
    if(height === null) { height = this.height; }
    if(depth === null) { depth = this.depth; }

    this.setDimensions(width, height, depth);

    this._wrapper.style.width = this.width + this.unit;
    this._wrapper.style.height = this.height + this.unit;
    this.getElement().style.width = this.width + this.unit;
    this.getElement().style.height = this.height + this.unit;


    this.draw();
    this.applyTransformations();

    return this;
  }


  setDimensions(width = 100, height = 100, depth = 100) {
    if(width !== null) {
      this.width = width;
    }

    if(height !== null) {
      this.height = height;
    }

    if(depth !== null) {
      this.depth = depth;
    }
    this._transformOrigin = Math.round(width * 0.5) + 'px ' + Math.round(height * 0.5) + 'px ' + Math.round(depth * 0.5) + 'px ';

    this.updateConnections();
    return this;
  }


  setTopContent(content) {
    this.topContent = content;
    if(this.topElement) {
      this.topElement.innerHTML = content;
    }
  }

  setFrontContent(content) {
    this.frontContent = content;
    if(this.frontElement) {
      this.frontElement.innerHTML = content;
    }
  }



  setWidth(width) {
    this.width = width;
    this.draw();
  }

  setHeight(height) {
    this.height = height;
    this.draw();
  }


  setDepth(height) {
    this.depth = height;
    this.draw();
  }

  getTopContentElement()
  {
    return this.topContentElement;
  }

  getFrontSide() {
    return this.frontElement;
  }


  draw() {
    super.draw();


    this.frontElement.style.width = this.width + this.unit;
    this.frontElement.style.height = this.height + this.unit;
    this.frontElement.style.transform = 'translateZ(' + this.depth  + this.unit + ')';
    // this.backElement.innerHTML = 'BACK';

    this.backElement.style.width = this.width + this.unit;
    this.backElement.style.height = this.height + this.unit;
    this.backElement.style.transform = 'rotateY(180deg) translateX(-' + this.width + this.unit + ')';
    //this.setFrontContent(this.frontContent);
    // this.frontElement.innerHTML = 'FRONT';



    this.topElement.style.width = this.width + this.unit;
    this.topElement.style.height = this.depth + this.unit;
    this.topElement.style.transform = 'rotateX(90deg)';
    this.topElement.innerHTML = this.topContent;

    // this.topElement.innerHTML = 'TOP';



    this.rightElement.style.width = this.depth + this.unit;
    this.rightElement.style.height = this.height+ this.unit;
    this.rightElement.style.transform = 'rotateY(-90deg)';
    // this.rightElement.innerHTML = 'RIGHT';

    this.leftElement.style.width = this.depth + this.unit;
    this.leftElement.style.height = this.height + this.unit;
    this.leftElement.style.transform = 'rotateY(90deg) translateX(-' + this.depth  + this.unit + ')';
    // this.leftElement.innerHTML = 'LEFT';

    this.bottomElement.style.width = this.width + this.unit;
    this.bottomElement.style.height = this.depth + this.unit;
    this.bottomElement.style.transform = 'rotateX(90deg)';
    // this.bottomElement.innerHTML = 'BOTTOM';



  }



  _buildSides() {

    this._wrapper.style.width = this.width + this.unit;
    this._wrapper.style.height = this.height + this.unit;


    this.frontElement = document.createElement('div');
    this.frontElement.classList.add('cuboid-side');
    this.frontElement.classList.add('cuboid-side-front');
    this.getElement().appendChild(this.frontElement);


    this.topElement = document.createElement('div');
    this.topElement.classList.add('cuboid-side');
    this.topElement.classList.add('cuboid-side-top');

    this.topContentElement = document.createElement('div');
    this.topContentElement.classList.add('side-top-content');
    this.topElement.appendChild(this.topContentElement);
    this.getElement().appendChild(this.topElement);



    this.bottomElement = document.createElement('div');
    this.bottomElement.classList.add('cuboid-side-bottom');
    this.bottomElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.bottomElement);





    this.backElement = document.createElement('div');
    this.backElement.classList.add('cuboid-side-back');
    this.backElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.backElement);


    this.rightElement = document.createElement('div');
    this.rightElement.classList.add('cuboid-side-right');
    this.rightElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.rightElement);

    this.leftElement = document.createElement('div');
    this.leftElement.classList.add('cuboid-side-left');
    this.leftElement.classList.add('cuboid-side');
    this.getElement().appendChild(this.leftElement);
  }

}
