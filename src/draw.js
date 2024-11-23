import { Block } from "./block.js";

export function drawGird(ctx, size, rows, cols) {
    for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
            drawBox(ctx, size, x, y, "gray");
        }
}

export function drawBox(ctx, size, x, y, color) {
    let dx = x * size;
    let dy = y * size;

    // fill box of color style
    ctx.fillStyle = color;
    ctx.fillRect(dx, dy, size, size);

    // draw box border
    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 3;
    ctx.strokeRect(dx, dy, size, size);
}

export function drawColorMap(ctx, size, map) {
    map.forEach((row, y) => row.forEach((color, x) => {
        if (color) {
            drawBox(ctx, size, x, y, getGrd(ctx, size, x, y, color));
        }
    }));
}


export function drawBlock(ctx, size, block) {
    if (!(block instanceof Block))
        return;

    for (let y = 0; y < block.height; y++)
        for (let x = 0; x < block.width; x++) {
            // check it was 1 of shape
            if (!block.shape[y][x])
                continue;
            // draw box of grd style
            let dx = x + block.x;
            let dy = y + block.y;

            let grd = getGrd(ctx, size, dx, dy, block.color);
            drawBox(ctx, size, dx, dy, grd);
        }
}

export function drawBlockBorder(ctx, size, block) {
    let dx = block.x * size - 2;
    let dy = block.y * size - 2;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.strokeRect(dx, dy, block.width * size + 4, block.height * size + 4);
}

export function getRandomVividColor() {
    let hue = Math.floor(Math.random() * 360);
    let saturation = 90;
    let lightness = 40;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getGrd(ctx, size, x, y, color) {
    // grd compute value
    let dx = x * size;
    let dy = y * size;
    let add = size * 0.2;
    // create grd style
    var grd = ctx.createRadialGradient(
        dx + add, dy + add, size * 0.08,
        dx + add, dy + add, size * 0.38
    );
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(1, color);

    return grd;
}