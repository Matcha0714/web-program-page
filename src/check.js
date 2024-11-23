export function checkFullRowBox(game) {
    return game.colorMap
        .map((row, index) => row.some((color) => color == null) ? -1 : index)
        .filter((idx) => idx != -1);
}

export function checkAllOverlap(game, block) {
    return (
        checkBlockOverlapMap(game, block) ||
        checkBlockOverlapBlockList(block, game.blockList)
    );
}

export function checkBlockOverlapMap(game, block) {
    return block.shape.some((row, y) => row.some((value, x) => {
        let dx = x + block.x;
        let dy = y + block.y;
        return (!game.contains(dx, dy) || (dy >= 0 && value && game.colorMap[dy][dx]));
    }));
}

// check block overlap of blockList (avoid itself)
export function checkBlockOverlapBlockList(block, blockList) {
    return blockList.some((otherBlock) => {
        if (block == otherBlock)
            return false;
        return checkBlockOverlap(block, otherBlock);
    });
}

function checkBlockOverlap(blockA, blockB) {
    let offsetY = Math.abs(Math.min(blockA.y, blockB.y));

    // create can contain both block map
    var map = Array.from({
        length: Math.max(blockA.y + blockA.height, blockB.y + blockB.height) + offsetY
    }, () => Array(
        Math.max(blockA.x + blockA.width, blockB.x + blockB.width)
    ).fill(0));

    // set blockA value at map
    blockA.shape.forEach((row, y) => row.forEach((value, x) => {
        map[blockA.y + y + offsetY][blockA.x + x] = value;
    }));
    // compare blockB each box of map
    return blockB.shape.some((row, y) => row.some((value, x) => {
        return (map[blockB.y + y + offsetY][blockB.x + x] && value)
    }));
}