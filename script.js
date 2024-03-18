// canvas stuff
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");


// set of boxes to add to canvas
let boxes = [
    new Box(canvas.width / 2 - 80, canvas.height / 2 - 80, 160, 160, "Big box."),
    new Box(80, 100, 100, 50, "Small box!", { color: "#00f" }),
    new Box(160, 380, 50, 50, "This box shouldn't be visible.", { color: "orange", isVisible: false }),
    new Box(450, 380, 25, 50, "This box should be visible,\nunlike the other orange box.\nIt also handles multiline decently.", { color: "orange" }),
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

// set up all the event listeners for mouse stuff
canvas.addEventListener("mousemove", (e) => {
    let bounds = canvas.getBoundingClientRect();
    [mouse.x, mouse.y] = [e.clientX - bounds.left, e.clientY - bounds.top];
});

canvas.addEventListener("mousedown", (e) => {
    [mouse.downX, mouse.downY, mouse.down] = [mouse.x, mouse.y, true];
});

canvas.addEventListener("mouseup", (e) => {
    [mouse.downX, mouse.downY, mouse.down, mouse.downComplete] = [-1, -1, false, false];
});

// main loop
function loop() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "2rem monospace";
    ctx.fillText("Hover over boxes to see tooltips!", 20, 40);

    for (box of boxes) {
        box.update(mouse);
        box.render(ctx, mouse);
    }

    requestAnimationFrame(loop);
}

// start the main loop
requestAnimationFrame(loop);