
class Viewport
{


    items = [];

    states = {
        drag: {
            enable: false,
            left: null,
            top: null
        },
        rotation: {
            enable: false,
            rotationX: null,
            rotationY: null,
            rotationZ:null
        }
    };

    unit = 'px';


    zoom = 100;
    perspective = 1600;

    translation = 0;
    rotationX = 45;
    rotationY = 0;
    rotationZ = 45;

    transformOrigin = '50% 50% 0';

    left = 0;
    top = 0;
    

    container = null;
    layout = null;
    scene = null;


    constructor(container)
    {

        this.container = container;

        this.layout = document.createElement('div');
        this.layout.classList.add('layout');


        this.scene = document.createElement('div');
        this.scene.classList.add('perspective');

        //this.scene.style.left = (document.body.offsetWidth / 2) + this.unit;
        //this.scene.style.top = (document.body.offsetHeight / 3) + this.unit  ;

        this.applyTransformations();
        
        this.layout.appendChild(this.scene);

        this.board = new Free(this);

        document.body.addEventListener('wheel', (evt) => this.handleWheel(evt));
        document.body.addEventListener('mousedown', (evt) => this.dragStart(evt));
        document.body.addEventListener('mouseup', (evt) => this.dragStop(evt));
        document.body.addEventListener('mousemove', (evt) => this.drag(evt));

        document.body.addEventListener('contextmenu', (evt) => this.rotate(evt));
    }


    setBoard(board) {
        this.board = board;
        this.board.setViewport(this);
    }

    addItem(item, x, y, z) {
        this.items.push(item);
        this.board.addItem(item, x, y, z);
    }


    rotate(evt) {
        evt.preventDefault();
    }



    drag(evt) {

        evt.preventDefault;

        if(this.states.drag.enable) {
            let xDelta = (evt.clientX - this.states.drag.left); // (this.perspective / 20);
            this.left = xDelta;
            let yDelta = (evt.clientY - this.states.drag.top); // (this.perspective / 20);
            this.top = yDelta;
            this.applyTransformations();
        }
        else if(this.states.rotation.enable) {

            let xDelta = (evt.clientX - this.states.rotation.left); // (this.perspective / 20);
            let yDelta = (evt.clientY - this.states.rotation.top); // (this.perspective / 20);

            this.rotationZ = Math.round(this.states.rotation.rotationZ + xDelta / 10);
            this.rotationX = Math.round(this.states.rotation.rotationX + yDelta/10);

            this.applyTransformations();
        }
    }

    dragStart(evt) {
        console.log('drag-start');
        evt.preventDefault();

        if(evt.which == 1) {
            this.states.drag.enable = true;
            this.states.drag.left = evt.clientX - this.left;
            this.states.drag.top = evt.clientY - this.top;
        }
        else if(evt.which == 3) {
            this.states.rotation.enable = true;

            this.states.rotation.left = evt.clientX;
            this.states.rotation.top = evt.clientY;

            this.states.rotation.rotationX = this.rotationX;
            this.states.rotation.rotationY = this.rotationY;
            this.states.rotation.rotationZ = this.rotationZ;

            console.log(this.states.rotation);
        }

    }

    dragStop(evt) {
        console.log('drag-stop');
        evt.preventDefault();


        this.states.drag.enable = false;
        this.states.drag.left = null;
        this.states.drag.top = null;

        this.states.rotation.enable = false;
        this.states.rotation.left = null;
        this.states.rotation.top = null;
        this.states.rotation.rotationX = this.rotationX;
        this.states.rotation.rotationY = this.rotationY;
        this.states.rotation.rotationZ = this.rotationZ;
    }
    

    handleWheel(evt) {
        //evt.preventDefault();
        let delta = evt.deltaY;
        if(delta > 0) {
            this.translate(-70);
        }
        else {
            this.translate(70);
        }


        this.applyTransformations();
    }

    translate(value) {

        this.translation += value;


        this.transformOrigin = '50% 50% ' + (this.translation * -1) + 'px';
        this.top += value/5;
        this.left += value/6;
        //this.transformOrigin = '50% ' + (this.translation * -1) + 'px ' + (this.translation * -1) + 'px ';
        //this.element.style.transformOrigin = '50% 50% 0';



        this.applyTransformations();
    }

    applyTransformations()
    {
        

        this.layout.style.left = this.left + this.unit;
        this.layout.style.top = this.top + this.unit;

        //!no change on zoom for the moment
        //this.element.style.zoom = this.zoom + '%';

        //this.scene.style.transformOrigin = this.transformOrigin;

        this.scene.style.transform = `
            perspective(` +this.perspective + this.unit + `)
            translateZ(` +this.translation + this.unit + `)
        `;


        if(this.board) {
            this.board.getElement().style.transform = `
            rotateX(` + this.rotationX + `deg)
            rotateY(` + this.rotationY + `deg)
            rotateZ(` + this.rotationZ + `deg)
        `;
        }


    }

    getScene() {
        return this.scene;
    }

    generate() {
        //this.board.setCellSize(cellSize);

        
        this.container.appendChild(this.layout);
        
        this.board.generate(
            this.scene
        );
        let scene = this.getScene();
        this.applyTransformations();
    }




    setRotation(x, y, z) {
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
        this.applyTransformations();
    }



    getBoard() {
        return this.board;
    }

    randomize() {
      this.board.randomize();
    }



    setTransformOrigin(x, y, z) {
        this.transformOrigin = x + ' ' + y + ' ' + z;
    }


}