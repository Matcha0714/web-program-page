import { Block, Direction } from "./block.js";
import { drawBlock, drawBox, drawGird, getGrd } from "./draw.js";
import { Game } from "./game.js";

const numberBlockList = [
    new Block(0, 0, 3, 5, [ // 0
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
    ]),
    new Block(0, 0, 3, 5, [ // 2
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
    ]),
    new Block(0, 0, 3, 5, [ // 4
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
    ]),
];

export async function gameoverAnime(game) {
    if (!(game instanceof Game))
        return;

    console.log("[anime] gameover start");

    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.cols; x++) {
            await drawFace(game, x, y)
        }
    }

    return new Promise(resolve => {
        setTimeout(() => {
        console.log("[anime] gameover end");
            resolve('');
        }, 1000);
    });
}

async function drawFace(game, x, y) {
    return new Promise(resolve => {
        setTimeout(() => {
            drawBox(game.context, game.size, x, y, getGrd(game.context, game.size, x, y, "#cfcfcf"));
            resolve('');
        }, 10);
    });
}

export async function showAnime(game) {
    if (!(game instanceof Game))
        return;

    let blockContent = [
        numberBlockList[1].copy(),
        numberBlockList[0].copy(),
        numberBlockList[1].copy(),
        numberBlockList[2].copy(),
    ];

    let contentLength = game.cols + 1;
    blockContent.forEach((block) => {
        block.y = game.rows / 2 - 3;
        block.x = contentLength;
        block.color = "#cfcfcf";

        contentLength += block.width + 1;
    });

    console.log("[anime] start");
    for (let i = 0; i < contentLength; i++) {
        await moveContent(blockContent, game);
    }
    console.log("[anime] end");
}

// 用了 promise 完全不懂工作原理 but it work QQ
async function moveContent(content, game) {
    return new Promise(resolve => {
        setTimeout(() => {
            drawGird(game.context, game.size, game.rows, game.cols);
            content.forEach((block) => {
                block.move(Direction.LEFT);
                drawBlock(game.context, game.size, block);
            });
            resolve('');
        }, 100);
    });
}