class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

        // 世界地图大小
        this.map_width = 5000;
        this.map_height = 5000;

        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;

        this.viewport_x = 0;
        this.viewport_y = 0;

        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;

        this.playground.$playground.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;

        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;
    }

    map_to_viewport(x, y) {
        return {
            x: x - this.viewport_x,
            y: y - this.viewport_y
        };
    }

    update_viewport(target) {
        if (!target) return;

        this.viewport_x = target.x - this.viewport_width / 2;
        this.viewport_y = target.y - this.viewport_height / 2;

        this.viewport_x = Math.max(0, Math.min(this.viewport_x, this.map_width - this.viewport_width));
        this.viewport_y = Math.max(0, Math.min(this.viewport_y, this.map_height - this.viewport_height));
    }

    render() {
        this.ctx.clearRect(0, 0, this.viewport_width, this.viewport_height);

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.viewport_width, this.viewport_height);
    }

    update() {
        if (this.playground.players.length > 0) {
            this.update_viewport(this.playground.players[0]);
        }
        this.render();
    }
}