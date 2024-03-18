console.debug = ()=>undefined;

// canvas stuff
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// set of boxes to add to canvas
let boxes = [
    new Box(canvas.width / 2 - 50, canvas.height / 2 - 50, 200, 100, "Big box."),
    new Box(100, 100, 100, 50, "Small box!", { color: "blue" }),
    new Box(160, 380, 50, 50, "This box shouldn't be visible.", { color: "orange", isVisible: false }),
    new Box(380, 380, 25, 50, "This box should be visible,\nunlike the other orange box.\nIt also handles multiline decently.", { color: "orange" }),
];

// mouse handler stuff
let mouse = {
    x: -1,
    y: -1,
    down: false,
    downX: -1,
    downY: -1,
    downComplete: false,
}

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.layerX;
    mouse.y = e.layerY;
});

canvas.addEventListener("mousedown", (e) => {
    console.debug("### mousedown @", mouse.x, mouse.y);
    [mouse.downX, mouse.downY, mouse.down] = [mouse.x, mouse.y, true];
});

canvas.addEventListener("mouseup", (e) => {
    console.debug("### mouseup @", mouse.x, mouse.y);
    [mouse.downX, mouse.downY, mouse.down, mouse.downComplete] = [-1, -1, false, false];
});

// main loop
function loop() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "2rem monospace";
    ctx.fillText("Hover over boxes to see tooltips",20,40)

    for (let box of boxes) {
        console.debug("### tick", new Date().toTimeString().split(" ")[0]);
        box.update(mouse);
        box.render(ctx, mouse);
    }
    requestAnimationFrame(loop);
}

// start the main loop
requestAnimationFrame(loop);