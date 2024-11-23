import { gameoverAnime, showAnime } from "./anime.js";
import { defaultBlockList, Direction } from "./block.js";
import { checkAllOverlap, checkFullRowBox } from "./check.js";
import { drawBlock, drawBlockBorder, drawColorMap, drawGird, getRandomVividColor } from "./draw.js";
import { bindButtonEvent, bindCanvasEvents, toggleButton, toggleIcon } from "./event.js";


export class Game {
    constructor() {
        this.cols = 10;
        this.rows = 20;
        this.size = 30;

        // canvas setting
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.cols * this.size;
        this.canvas.height = this.rows * this.size;
        this.canvas.style.border = "3px solid black";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.startGame();
    }

    async startGame() {
        await showAnime(this);
        bindButtonEvent(this);
        bindCanvasEvents(this);
        console.log("bind event");

        this.reset();
    }

    draw() {
        drawGird(this.context, this.size, this.rows, this.cols);
        drawColorMap(this.context, this.size, this.colorMap);
        this.blockList.forEach((block) => drawBlock(this.context, this.size, block));
        this.blockList.forEach((block) => { if (block.focus) drawBlockBorder(this.context, this.size, block) });
    }

    reset() {
        // default values
        this.blockList = [];
        this.colorMap = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.speed = 1000;
        this.tick = 0;
        this.running = false;
        this.draw();
        clearInterval(this.interval);
        toggleIcon.src = "./imgs/start.png";
    }

    start() {
        clearInterval(this.interval);
        this.interval = setInterval(this.update.bind(this), this.speed);
        toggleIcon.src = "./imgs/stop.png";
        this.running = true;
    }

    stop() {
        clearInterval(this.interval);
        toggleIcon.src = "./imgs/start.png";
        this.running = false;
    }

    // update every tick of speed
    async update() {
        this.tick += 1;

        // move down all block and check blcok live
        var sortedBlockList = [...this.blockList].sort((a, b) => b.y - a.y);

        sortedBlockList.forEach(async (block) => {
            var tmpBlock = block.copy();
            block.move(Direction.DOWN);

            if (checkAllOverlap(this, block)) {

                // ===============================================================
                // GAME OVER !
                // ===============================================================
                if (tmpBlock.y <= 0) {
                    console.log("GAME OVER");
                    this.stop();
                    await gameoverAnime(this);
                    this.reset();
                    return;
                }
                // overlap event
                tmpBlock.shape.forEach((row, y) => row.forEach((value, x) => {
                    if (value)
                        this.colorMap[tmpBlock.y + y][tmpBlock.x + x] = tmpBlock.color;
                }))
                block.width = -1;
            }
        });
        this.blockList = this.blockList.filter((block) => block.width != -1);

        // remove full row
        checkFullRowBox(this).forEach((idx) => {
            console.log(`clear row at index[${idx}]`)
            this.colorMap.splice(idx, 1);
            this.colorMap.unshift(Array(this.cols).fill(null));
        });

        // add block when empty
        if (this.blockList.length == 0 || this.tick % 5 == 0) {
            this.tick = 0;

            // add new block
            var block = defaultBlockList[Math.floor(Math.random() * defaultBlockList.length)].copy();
            block.y = -block.height;
            block.color = getRandomVividColor();
            this.blockList.push(block);

            if (!this.blockList.some((block) => block.focus)) {
                block.focus = true;
            }
        }
        this.draw();
    }

    // control from html element or key press event
    move(control = "") {
        if (!this.blockList)
            return;

        switch (control.toLowerCase()) {
            case '+': this.speedUp(); return;
            case '-': this.speedDown(); return;
            case 'enter': toggleButton.click(); break;
        }

        var block = this.blockList.find((block) => block.focus);
        if (!block) {
            console.log("block focus not yet!");
            return;
        }
        var tmpBlock = block.copy();

        switch (control.toLowerCase()) {
            case 'a': block.move(Direction.LEFT); break;
            case 'd': block.move(Direction.RIGHT); break;
            case 's': block.move(Direction.DOWN); break;
            case 'r':
                // process right edge rotate
                if (block.x + block.height > this.cols) {
                    block.x -= block.height - block.width;
                }
                block.rotate(); break;
            case ' ':
                while (!checkAllOverlap(this, block))
                    block.move(Direction.DOWN);
                block.y -= 1; break;
 
        }

        if (checkAllOverlap(this, block)) {
            block.set(tmpBlock);
            return false;
        }
        this.draw();
        return true;
    }

    // 沒想到只用到一次
    setFocusBlock(block) {
        if (!block.focus)
            this.blockList.forEach((block) => block.focus = false);
        block.focus = !block.focus;
    }

    speedUp() {
        this.speed /= 2;
        this.start();
    }

    speedDown() {
        this.speed *= 2;
        this.start();
    }

    contains(x, y) {
        return !(x < 0 || this.cols <= x || this.rows <= y);
    }
}