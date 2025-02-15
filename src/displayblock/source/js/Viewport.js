class Viewport extends Animable
{

    _centerOrigin = false;


    _container = null;
    _layout = null;
    _perspective = null;

    _scenes = {};
    _items = [];

    constructor(container) {
        super();

        this._container = container;

        this._layout = this.getElement();
        this._layout.classList.add('layout');

        this._container.appendChild(this._layout);

        this._perspective = this.getWrapper();
        this._perspective.classList.add('perspective', 'layout__perspective');

        this._layout.appendChild(this._perspective);

        this.createScene('default');


        this._interactionManager = new ViewportInteraction(this);
        this._interactionManager.makeInteractive();
    }

    createScene(name) {
        this.addScene(name, new Free(this));
        this.getScene(name).setContainer(this._perspective);
        this.getScene(name).generate();
        return this;
    }

    addScene(name, scene) {
        this._scenes[name] = scene;
        scene.setViewport(this);
        scene.setName(name);
        return this;
    }

    getScene(name) {
        if(typeof(this._scenes[scene]) === 'undefined') {
            return false;
        }

        return this._scenes[scene];
    }


    addItem(item, x, y, z, centered = false, scene = 'default') {
        this._items.push(item);

        if(typeof(this._scenes[scene]) === 'undefined') {
            this.createScene(scene);
        }

        if (this._centerOrigin || centered) {
            this._scenes[scene].addItem(item, x + this.getWidth() / 2, y + this.getHeight() / 2, z);

        } else {
            this._scenes[scene].addItem(item, x, y, z);
        }
        this._scenes[scene].refresh();
    }


    draw() {
        this._container.appendChild(this._layout);

        for (let name in this._scenes) {
            let scene = this._scenes[name];
            scene.generate();
        }

        this.applyTransformations();
    }


    getWidth() {
        return this._layout.offsetWidth
    }

    getHeight() {
        return this._layout.offsetHeight
    }

    addAxes() {

        let x = 0;
        let y = 0;
        let z = 0;

        let xAxis = new Cuboid(2000, 3, 3);
        xAxis.addClass('axis');
        this.addItem(xAxis, -1000 + x + this.getWidth() / 2, y + this.getHeight() / 2, z);

        let yAxis = new Cuboid(3, 2000, 3);
        yAxis.addClass('axis');
        this.addItem(yAxis, x + this.getWidth() / 2, -1000 + y + this.getHeight() / 2, z);

        let zAxis = new Cuboid(3, 3, 2000);
        zAxis.addClass('axis');
        this.addItem(zAxis, x + this.getWidth() / 2, y + this.getHeight() / 2, -1000 + z);
    }

    getScene(name = 'default') {
        if(typeof(this._scenes[name]) !== 'undefined') {
            return this._scenes[name];
        }
        else {
            return false;
        }
    }
}
