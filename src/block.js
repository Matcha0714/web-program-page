import { getRandomVividColor } from "./draw.js";

export const Direction = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    ROTATE: 'ROTATE',
}

export class Block {
    constructor(x, y, width, height, shape) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shape = shape;

        this.color = getRandomVividColor();
        this.focus = false;
    }

    move(dir) {
        switch (dir) {
            case Direction.LEFT: this.x -= 1; break;
            case Direction.RIGHT: this.x += 1; break;
            case Direction.DOWN: this.y += 1; break;
            case Direction.ROTATE: this.rotate(); break;
        }
    }

    rotate() {
        [this.width, this.height] = [this.height, this.width];
        this.shape = this.shape[0].map((_, index) => this.shape.map(row => row[index]).reverse());
    }

    contains(x, y) {
        return !(
            x < this.x || this.x + this.width <= x ||
            y < this.y || this.y + this.height <= y
        );
    }

    set(obj) {
        Object.assign(this, obj);
    }

    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

export const defaultBlockList = [
    new Block(3, 3, 2, 2, [
        [1, 1],
        [1, 1]
    ]),
    new Block(1, 10, 4, 1, [
        [1, 1, 1, 1]
    ]),
    new Block(5, 3, 3, 2, [
        [1, 1, 1],
        [0, 1, 0]
    ]),
    new Block(3, 6, 2, 3, [
        [0, 1],
        [1, 1],
        [1, 0]
    ]),
    new Block(3, 3, 2, 3, [
        [0, 1],
        [0, 1],
        [1, 1],
    ]),
];