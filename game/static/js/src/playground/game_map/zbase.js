class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

        // 世界地图大小 (5000x5000)
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

        // ⭐ 优化：生成 300 颗随机星星
        this.stars = [];
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: Math.random() * this.viewport_width,  // 初始分布在当前屏幕
                y: Math.random() * this.viewport_height, // 初始分布在当前屏幕
                radius: Math.random() * 1.5 + 0.5,       // 星星大小 0.5~2px
                speed_factor: Math.random() * 0.3 + 0.2, // ⭐ 关键：每颗星移动速度不同，更有层次感
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
            });
        }
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

    // 世界坐标转视口坐标 (用于画边界线和玩家)
    map_to_viewport(x, y) {
        return {
            x: x - this.viewport_x,
            y: y - this.viewport_y
        };
    }

    update_viewport(target) {
        if (!target) return;

        // 让视角中心对准目标玩家
        this.viewport_x = target.x - this.viewport_width / 2;
        this.viewport_y = target.y - this.viewport_height / 2;

        // 限制视角不超出 5000x5000 的世界地图边缘
        this.viewport_x = Math.max(0, Math.min(this.viewport_x, this.map_width - this.viewport_width));
        this.viewport_y = Math.max(0, Math.min(this.viewport_y, this.map_height - this.viewport_height));
    }

    // ⭐ 核心优化：带视差滚动的星星渲染
    render_stars() {
        for (let star of this.stars) {
            // 根据视口偏移和星星自身的速率系数计算绘制位置
            // 使用取模 (%) 运算确保星星在屏幕边缘消失后从另一侧冒出来（无限循环背景）
            let x = (star.x - this.viewport_x * star.speed_factor) % this.viewport_width;
            let y = (star.y - this.viewport_y * star.speed_factor) % this.viewport_height;

            // 处理取模后的负数情况，确保坐标永远在视口内
            if (x < 0) x += this.viewport_width;
            if (y < 0) y += this.viewport_height;

            this.ctx.beginPath();
            this.ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.fill();
        }
    }

    render() {
        // 1. 清理画布
        this.ctx.clearRect(0, 0, this.viewport_width, this.viewport_height);

        // 2. 绘制黑色宇宙背景
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.viewport_width, this.viewport_height);

        // 3. 绘制会滚动的星星
        this.render_stars();

        // 4. 绘制世界地图的白色边界线 (5000x5000 的大框)
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 4;
        let border = this.map_to_viewport(0, 0);
        this.ctx.strokeRect(border.x, border.y, this.map_width, this.map_height);
    }

    update() {
        // 锁定视角到“我”这个玩家
        let me = null;
        for (let p of this.playground.players) {
            if (p.character === "me") {
                me = p;
                break;
            }
        }

        if (me) {
            this.update_viewport(me);
        } else if (this.playground.players.length > 0) {
            this.update_viewport(this.playground.players[0]);
        }

        this.render();
    }
}