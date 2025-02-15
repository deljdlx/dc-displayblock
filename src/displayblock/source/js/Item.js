class Item extends Animable
{
  _id = null;

  _board;

  listeners = {};
  data = {};

  _origin = {
    x: 0,
    y:0,
    z: 0
  };


  constructor(id = null)
  {
    super();
    if(id === null) {
      this._id = "item-" + Math.random() + '-' + (new Date()).getTime();
    }
  }



  setBoard(board) {
    this._board = board;
    return this;
  }


  getBoard() {
    return this._board;
  }

  addEventListener(eventName, callback) {
    if(typeof(this.listeners[eventName]) === 'undefined') {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    this.getWrapper().addEventListener(eventName, callback);
    return this;
  }


  getId() {
    return this._id;
  }


  setId() {
    this._id = id;
    return this;
  }


  addClass(cssClass) {
    this._element.classList.add(cssClass);
  }

  removeClass(cssClass) {
    this.getElement().classList.remove(cssClass);
  }



  setData(name, value) {
    this.data[name] = value;
    return this;
  }


  getData(name) {
    if(name) {
      if(typeof(this.data[name]) !== 'undefined') {
        return this.data[name];
      }
      return null;
    }

    return this.data;
  }


  clearData() {
    this.data = {};
    return this;
  }
}
