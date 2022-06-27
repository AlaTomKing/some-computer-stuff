"use strict";

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    AddObject(x, y) {
        array.push(['wire', x, y])
        //console.log(array)
    }

    CheckObject(x, y) {
        array.forEach(item => {
            if (item[1] == x && item[2] == y) {
                return item[0]
            }
        });
    }

    SelectTexture(name) {
        let r;
        switch (name) {
            case 'wire':
                return './Resources/Textures/wire.svg';
        }
        return;
    }
}

class Position2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}

let array = [];

let canvas = document.querySelector('canvas');
let ctx;
let gridSize = 40;
let distancefromtitle = 30.5;

let currentMouseGridPosX, currentMouseGridPosY;
let grid = new Grid(5, 5);
let camera = new Position2D(100, 100);
let zoom = 1;

let mousex, mousey;

let w = false;
let a = false;
let s = false;
let d = false;

let res = 2;

let texture = new Image();

function resize() {
    canvas.style.width = (innerWidth) + 'px';
    canvas.style.height = (innerHeight - distancefromtitle) + 'px';

    canvas.width = (innerWidth) * (devicePixelRatio * res);
    canvas.height = (innerHeight - distancefromtitle) * (devicePixelRatio * res);

    if (ctx) {
        ctx.scale((devicePixelRatio * res), (devicePixelRatio * res));
    }

    render();
}

function canvass() {
    ctx = canvas.getContext('2d');
    render();
}

function render() {
    if (ctx) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        // BACKGROUND

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#4c4c4c';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        // TRANSPARENT BACKGROUND GRID

        ctx.lineWidth = 2;

        ctx.globalAlpha = 0.1;
        let targetX = (Math.ceil(Math.ceil((innerWidth * devicePixelRatio) / (gridSize * zoom)) / 2) * 2) + 2;
        let targetY = (Math.ceil(Math.ceil((innerHeight * devicePixelRatio) / (gridSize * zoom)) / 2) * 2) + 2;

        //console.log(targetX)

        //console.log(camera.x - (Math.ceil(camera.x / gridSize) * gridSize), (Math.ceil(camera.x / gridSize) * gridSize))

        for (let i = 0; i < targetY; i++) {
            for (let j = 0; j < targetX; j++) {
                ctx.strokeRect(
                    (((j * (gridSize * zoom) - (camera.x - (Math.ceil(camera.x / (gridSize * zoom)) * (gridSize * zoom)))) - (targetX * (gridSize * zoom)) / 2) + innerWidth / 2),
                    ((i * (gridSize * zoom) - (camera.y - (Math.ceil(camera.y / (gridSize * zoom)) * (gridSize * zoom)))) - (targetY * (gridSize * zoom)) / 2) + innerHeight / 2,
                    (gridSize * zoom), (gridSize * zoom));
            }
        }

        // BIGGER BACKGROUND GRID

        ctx.lineWidth = 2;

        ctx.globalAlpha = 0.1;

        let biggergridSize = (gridSize * 8) * zoom;
        let targetX2 = (Math.ceil(Math.ceil((innerWidth * devicePixelRatio) / biggergridSize) / 2) * 2) + 2;
        let targetY2 = (Math.ceil(Math.ceil((innerHeight * devicePixelRatio) / biggergridSize) / 2) * 2) + 2;

        for (let i = 0; i < targetY2; i++) {
            for (let j = 0; j < targetX2; j++) {
                ctx.strokeRect(
                    ((j * biggergridSize - (camera.x - (Math.ceil(camera.x / biggergridSize) * biggergridSize))) - (targetX2 * biggergridSize) / 2) + innerWidth / 2,
                    ((i * biggergridSize - (camera.y - (Math.ceil(camera.y / biggergridSize) * biggergridSize))) - (targetY2 * biggergridSize) / 2) + innerHeight / 2,
                    biggergridSize, biggergridSize);
            }
        }

        // GRID
        let gridwidth = grid.width;
        let gridheight = grid.height;
        //console.log(gridwidth, gridheight);

        ctx.globalAlpha = 1;
        for (let i = 0; i < gridheight; i++) {
            for (let j = 0; j < gridwidth; j++) {
                ctx.strokeRect((j * (gridSize * zoom) - camera.x) + innerWidth / 2, (i * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));
            }
        }

        // OBJECTS

        array.forEach(item => {
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#000000';
            //ctx.fillRect((item[1] * (gridSize * zoom) - camera.x) + innerWidth / 2, (item[2] * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));
            texture.src = grid.SelectTexture(item[0]);
            ctx.drawImage(texture, 0, 3, 2, 2, (item[1] * (gridSize * zoom) - camera.x) + innerWidth / 2, (item[2] * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));
        });

        // MOUSE SELECTION GRID

        switch (placable()) {
            case 1:
                ctx.globalAlpha = 0.1;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect((currentMouseGridPosX * (gridSize * zoom) - camera.x) + innerWidth / 2, (currentMouseGridPosY * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));

                break;
            case 2:
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = '#ff0000';
                ctx.fillRect((currentMouseGridPosX * (gridSize * zoom) - camera.x) + innerWidth / 2, (currentMouseGridPosY * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));

                break;
            default:
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect((currentMouseGridPosX * (gridSize * zoom) - camera.x) + innerWidth / 2, (currentMouseGridPosY * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));
                texture.src = './Resources/Textures/wire.svg';
                ctx.drawImage(texture, 0, 3, 2, 2, (currentMouseGridPosX * (gridSize * zoom) - camera.x) + innerWidth / 2, (currentMouseGridPosY * (gridSize * zoom) - camera.y) + innerHeight / 2, (gridSize * zoom), (gridSize * zoom));

                break;
        }
    }

}

function Lerp(min, max, value) {
    return (max - min) * value + min;
}

function placable() {
    //console.log(currentMouseGridPosX, currentMouseGridPosY);
    //console.log(grid.width, grid.height);
    let rgr = false;
    array.forEach(item => {
        if ((currentMouseGridPosX == item[1]) && (currentMouseGridPosY == item[2]))
            rgr = true;
    })

    if (rgr) {
        return 2;
    } else if ((currentMouseGridPosX < 0 || currentMouseGridPosX > grid.width - 1) || (currentMouseGridPosY < 0 || currentMouseGridPosY > grid.height - 1)) {
        return 1;
    } else {
        return 0;
    }
}

function update() {
    if (w) {
        camera.move(0, -2);
    }
    if (a) {
        camera.move(-2, 0);
    }
    if (s) {
        camera.move(0, 2);
    }
    if (d) {
        camera.move(2, 0);
    }

    trackMouse();
    render();
    window.requestAnimationFrame(update);
}

function keydown(e) {
    if (e.key == 'w' || e.key == 'ArrowUp') {
        w = true;
    }
    if (e.key == 'a' || e.key == 'ArrowLeft') {
        a = true;
    }
    if (e.key == 's' || e.key == 'ArrowDown') {
        s = true;
    }
    if (e.key == 'd' || e.key == 'ArrowRight') {
        d = true;
    }
}

function keyup(e) {
    if (e.key == 'w' || e.key == 'ArrowUp') {
        w = false;
    }
    if (e.key == 'a' || e.key == 'ArrowLeft') {
        a = false;
    }
    if (e.key == 's' || e.key == 'ArrowDown') {
        s = false;
    }
    if (e.key == 'd' || e.key == 'ArrowRight') {
        d = false;
    }
}

function trackMouse(mouse) {
    if (mouse) {
        mousex = mouse.x;
        mousey = mouse.y;
    }
    let xx = Math.floor((mousex - (innerWidth / 2) + camera.x) / (gridSize * zoom));
    let yy = Math.floor((mousey - distancefromtitle - (innerHeight / 2) + camera.y) / (gridSize * zoom));
    if (ctx && (currentMouseGridPosX != xx || currentMouseGridPosY != yy)) {
        currentMouseGridPosX = xx;
        currentMouseGridPosY = yy;
        render();
    }
}

function zooming(whel) {
    zoom += whel.deltaY * -0.01;
    zoom = Math.min(Math.max(0.5, zoom), 10);
    //console.log(zoom)
}

function place() {
    if (placable() == 0) {
        grid.AddObject(currentMouseGridPosX, currentMouseGridPosY);
    }
}

window.addEventListener('mousemove', (mouse) => trackMouse(mouse));

window.addEventListener('load', () => { canvass(); resize() });
window.addEventListener('resize', () => resize());

window.addEventListener('keydown', (e) => keydown(e));
window.addEventListener('keyup', (e) => keyup(e));

window.addEventListener('wheel', (e) => zooming(e))

window.addEventListener('mousedown', () => place())

window.addEventListener('wheel', e => {
    e.preventDefault();
}, { passive: false });

window.requestAnimationFrame(update);