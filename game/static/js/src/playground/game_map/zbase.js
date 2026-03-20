class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

        // 1. 新增：超大地图的实际尺寸（根据你的需求调整，比如 5000x5000）
        this.map_width = 5000;    // 全局大地图宽度
        this.map_height = 5000;   // 全局大地图高度

        // 2. 窗口视口尺寸（保持和原有playground一致，不改动）
        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;

        // 3. 新增：视口偏移量（控制显示大地图的哪一部分，初始可居中或跟随主角）
        this.viewport_x = 0;  // 初始X偏移（可设为0，或主角初始坐标-视口宽/2）
        this.viewport_y = 0;  // 初始Y偏移

        // 4. 画布仍创建为视口大小（原有逻辑不变，只是渲染时做坐标映射）
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;
        this.playground.$playground.append(this.$canvas);

        // 可选：如果有主角，初始视口跟随主角
        if (this.playground.main_character) {
            this.update_viewport(this.playground.main_character);
        }
    }

    start() {
        this.$canvas.focus(); // 原有逻辑不变
    }

    // 新增：视口更新方法（跟随目标，核心适配点）
    update_viewport(target) {
        if (!target) return;
        // 让目标居中显示（核心：视口偏移 = 目标全局坐标 - 视口宽/2）
        let target_x = target.x - this.viewport_width / 2;
        let target_y = target.y - this.viewport_height / 2;
        // 边界限制：视口不超出超大地图范围
        this.viewport_x = Math.max(0, Math.min(target_x, this.map_width - this.viewport_width));
        this.viewport_y = Math.max(0, Math.min(target_y, this.map_height - this.viewport_height));
    }

    // 原有resize方法改造：只调整视口尺寸，不改动逻辑
    resize() {
        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;
        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;
        // 原有背景渲染逻辑保留，只是后续render会覆盖
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    // 新增：坐标映射工具方法（全局坐标 → 视口画布坐标）
    map_to_viewport(x, y) {
        return {
            x: x - this.viewport_x,
            y: y - this.viewport_y
        };
    }

    // 改造render：仅做视口内的背景渲染（原有游戏元素的渲染交给外部，只需调用映射方法）
    render() {
        // 1. 清空画布
        this.ctx.clearRect(0, 0, this.viewport_width, this.viewport_height);
        // 2. 渲染背景（半透明黑，原有逻辑保留）
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.viewport_width, this.viewport_height);
    }

    // 改造update：仅更新视口 + 渲染背景（不改动原有游戏元素的更新逻辑）
    update() {
        // 关键：每帧更新视口（跟随主角，若没有则注释掉）
        if (this.playground.main_character) {
            this.update_viewport(this.playground.main_character);
        }
        this.render(); // 仅渲染背景，游戏元素由各自的render渲染
    }
}