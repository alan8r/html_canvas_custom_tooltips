class Box {

    // class constants
    static DEFAULT_COLOR = "seagreen";
    static DEFAULT_HOVER_COLOR = "red";
    static DEFAULT_ISVISIBLE = true;

    // class constructor. takes in location/dimensions, tooltip text and modifier options
    constructor(x, y, width, height, tooltipText, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tooltipText = tooltipText;
        this.options = options;
        this.color = options.color || Box.DEFAULT_COLOR;
        this.showTooltip = false;

        if (this.options.isVisible === undefined) this.options.isVisible = Box.DEFAULT_ISVISIBLE;
        if (this.options.color === undefined) this.options.color = this.color;
    }

    update(mouse) {
        // if the box is visible and the mouse is hovering over the box
        if (this.options.isVisible && this.mouseHover(mouse)) {

            this.color = this.options.hoverColor || Box.DEFAULT_HOVER_COLOR;

            // set the tooltip text to visible
            this.showToolTip = true;

            // if the box is clicked, and its the "first" click (so action doesnt repeat)
            if (this.mouseClicked(mouse) && !mouse.downComplete) {
                console.log(this.options.color + " box clicked!");
                mouse.downComplete = true;
            }

        } else {
            this.color = this.options.color || Box.DEFAULT_COLOR;
            this.showToolTip = false;
        }
    }

    // returns true/false based on whether mouse is hovering over box
    mouseHover(mouse) {
        return (
            mouse.x >= this.x &&
            mouse.x < this.x + this.width &&
            mouse.y >= this.y &&
            mouse.y < this.y + this.height
        );
    }

    // returns true/false based on whether mouse clicks on box
    mouseClicked(mouse) {
        return (
            mouse.downX >= this.x &&
            mouse.downX < this.x + this.width &&
            mouse.downY >= this.y &&
            mouse.downY < this.y + this.height
        );
    }

    // box drawing logic, needs mouse as param for tooltip location
    render(ctx, mouse) {
        // if the box isn't visible, dont draw it
        if (!this.options.isVisible) return;

        // otherwise, set up the colors and draw it
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // setup draw coords to handle off-screen clipping adjustment
        let drawX = mouse.x;
        let drawY = mouse.y;

        // next 2 lines are for testing a clipping edge-case and should be disabled
        // ctx.fillStyle = "black"
        // ctx.fillRect(50, 0, ctx.canvas.width / 2, 50)

        // once the box is drawn, check if the tooltip is visible
        if (this.showToolTip) {

            // for handling linebreaks since ctx.fillText doesn't
            let textArr = this.tooltipText.split("\n");

            // get the longest line of a multiline string, since this will determine the tooltip box width
            let longestStr = "";
            for (let str of textArr) {
                if (str.length > longestStr.length) {
                    longestStr = str;
                }
            }

            // set up the font and get its drawing dimensions from the longest line of text
            ctx.font = "0.75rem monospace";
            let textDims = ctx.measureText(longestStr);
            let textW = Math.ceil(textDims.width);
            let textH = Math.ceil(textDims.actualBoundingBoxAscent + textDims.actualBoundingBoxDescent);
            let ttMargin = 9 + textArr.length;

            //set up measurements for use in position correction
            let tooltipW = textW + (ttMargin / 2);
            let tooltipH = textH + (ttMargin / 2);
            let tooltipHMulti = textH * textArr.length + ttMargin;

            let tooltipLeft = drawX - (ttMargin / 2);
            let tooltipRight = drawX + tooltipW;
            let tooltipTop = drawY + tooltipH;
            let tooltipBottom = drawY + tooltipH + (textH * textArr.length + ttMargin);
            
            let canvasLeft = 0;
            let canvasRight = ctx.canvas.width;
            let canvasTop = 0;
            let canvasBottom = ctx.canvas.height;
            
            // assign the draw coords with positional fixes if necessary
            if (tooltipLeft < canvasLeft) drawX = 0 + (ttMargin / 2);
            if (tooltipRight > canvasRight) drawX = canvasRight - tooltipW;
            if (tooltipTop < canvasTop) drawY = 17 + tooltipH; // never triggers under normal circumstances
            if (tooltipBottom > canvasBottom) drawY = canvasBottom - (tooltipH + tooltipHMulti);

            // draw the box that goes behind the tooltip text
            ctx.fillStyle = "#aaa";
            ctx.fillRect(drawX - (ttMargin / 2), drawY + textH + (ttMargin / 2), textW + ttMargin, (textH * textArr.length) + ttMargin);

            //draw the tooltip text. the for loop handles multiline strings
            ctx.fillStyle = "black";
            for (let i = 0; i < textArr.length; i++) {
                ctx.fillText(textArr[i], drawX, 20 + drawY + textH + ((textH + 2) * i));
            }
        }
    }
}