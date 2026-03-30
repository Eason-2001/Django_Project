class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.width = 200;
        this.height = 200;

        this.$canvas = $(`<canvas class="mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');

        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.playground.$playground.append(this.$canvas);

        // ⭐ 核心修复：强制重置 CSS 样式，确保在右下角且不被居中规则干扰
        this.$canvas.css({
            "position": "absolute",
            "bottom": "20px",
            "right": "20px",
            "top": "auto",
            "left": "auto",
            "transform": "none",
            "background": "rgba(0,0,0,0.5)",
            "border": "2px solid white",
            "z-index": "1000" // 确保在最顶层
        });
    }

    update() {
        this.render();
    }

    render() {
        const map = this.playground.game_map;
        if (!map) return;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. 绘制半透明黑色背景
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. 绘制玩家点
        for (let p of this.playground.players) {
            // 计算玩家在小地图上的比例坐标
            let x = (p.x / map.map_width) * this.width;
            let y = (p.y / map.map_height) * this.height;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);

            if (p.character === "me") {
                ctx.fillStyle = "#00FF00"; // 自己显示为亮绿色
            } else {
                ctx.fillStyle = "#FF0000"; // 敌人显示为红色
            }
            ctx.fill();
        }

        // 3. 绘制黄色视野框（代表当前屏幕在世界地图的哪个位置）
        let vx = (map.viewport_x / map.map_width) * this.width;
        let vy = (map.viewport_y / map.map_height) * this.height;
        let vw = (map.viewport_width / map.map_width) * this.width;
        let vh = (map.viewport_height / map.map_height) * this.height;

        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vx, vy, vw, vh);
    }
}