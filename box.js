class Box {

    static DEFAULT_COLOR = "seagreen";
    static DEFAULT_HOVER_COLOR = "red";
    static DEFAULT_ISVISIBLE = true;

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
    }

    update(mouse) {
        if (this.mouseHover(mouse) && this.options.isVisible) {
            this.color = this.options.hoverColor || Box.DEFAULT_HOVER_COLOR;
            this.showToolTip = true;
            if (this.mouseClicked(mouse) && !mouse.downComplete) {
                console.log("Box clicked!");
                mouse.downComplete = true;
            }
        } else {
            this.color = this.options.color || Box.DEFAULT_COLOR;
            this.showToolTip = false;
        }
    }

    mouseHover(mouse) {
        return (
            mouse.x >= this.x &&
            mouse.x <= this.x + this.width &&
            mouse.y >= this.y &&
            mouse.y <= this.y + this.height
        );
    }

    mouseClicked(mouse) {
        return (
            mouse.downX >= this.x &&
            mouse.downX <= this.x + this.width &&
            mouse.downY >= this.y &&
            mouse.downY <= this.y + this.height
        );
    }

    render(ctx, mouse) {
        if (!this.options.isVisible) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.showToolTip) {
            let textArr = this.tooltipText.split("\n");
            let longestStr = "";
            for (let str of textArr) {
                if (str.length > longestStr.length) {
                    longestStr = str;
                }
            }
            ctx.font = "0.75rem monospace";
            let textDims = ctx.measureText(longestStr);
            let textW = Math.ceil(textDims.width);
            let textH = Math.ceil(textDims.actualBoundingBoxAscent + textDims.actualBoundingBoxDescent);
            let ttBorder = 2;
            let ttMargin = 10 + textArr.length;
            let mYOffset = mouse.y + 20 + textH;

            ctx.fillStyle = "#999";
            ctx.fillRect(mouse.x - (ttMargin / 2), mouse.y + textH + (ttMargin / 2), textW + ttMargin, (textH * textArr.length) + ttMargin);

            ctx.fillStyle = "black";
            for (let i = 0; i < textArr.length; i++) {
                ctx.fillText(textArr[i], mouse.x, 20 + mouse.y + textH + ((textH + 2) * i));
            }
        }
    }
}