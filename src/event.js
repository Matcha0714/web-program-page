import { Game } from "./game.js";
import { checkAllOverlap } from "./check.js";

export function bindCanvasEvents(game) {
    if (!(game instanceof Game))
        return;

    let curBlock = null;
    let mouseDownPt = null, blockOffsetPt = null;

    game.canvas.addEventListener('mousedown', (event) => {
        let gridPt = getGridPoint(event, game.size);
        const block = game.blockList.find((block) => block.contains(gridPt.x, gridPt.y));

        if (block) {
            curBlock = block;
            mouseDownPt = gridPt;
            blockOffsetPt = { x: gridPt.x - block.x, y: gridPt.y - block.y };
        }
    });
    game.canvas.addEventListener('mousemove', (event) => {
        if (!curBlock || !curBlock.focus) return;

        let gridPt = getGridPoint(event, game.size);
        var tmpBlock = curBlock.copy();

        curBlock.x = gridPt.x - blockOffsetPt.x;
        curBlock.y = gridPt.y - blockOffsetPt.y;

        if (checkAllOverlap(game, curBlock)) {
            curBlock.set(tmpBlock);
        }
        game.draw();
    });
    game.canvas.addEventListener('mouseup', (event) => {
        if (!curBlock) return;

        let gridPt = getGridPoint(event, game.size);

        if (gridPt.x == mouseDownPt.x && gridPt.y == mouseDownPt.y) {
            game.setFocusBlock(curBlock);
        }
        curBlock = null;
        game.draw();
    });
    // Clear selected block when mouse leaves the canvas
    game.canvas.addEventListener('mouseleave', () => {
        curBlock = null;
    });
}

export let toggleButton;
export let toggleIcon;

export function bindButtonEvent(game) {
    if (!(game instanceof Game))
        return;

    toggleButton = document.getElementById("toggleButton");
    let resetButton = document.getElementById("resetButton");
    toggleIcon = document.getElementById("toggleIcon");

    toggleButton.addEventListener('click', (event) => {
        if (game.running) {
            game.stop();
        } else {
            game.start();
        }
        toggleButton.blur();
    });

    resetButton.addEventListener('click', (event) => {
        game.reset();
        resetButton.blur();
    });
}

function getGridPoint(event, size) {
    return {
        x: Math.floor(event.offsetX / size),
        y: Math.floor(event.offsetY / size),
    }
}

