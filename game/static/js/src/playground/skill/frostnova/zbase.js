export class FrostNova extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
        this.radius = 0;
    }

    start() {
        const p = this.player;

        // ⭐ 获取屏幕坐标
        const pos = this.playground.game_map.map_to_viewport(p.x, p.y);

        // ⭐ 画冰环
        const ctx = this.playground.game_map.ctx;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 200, 0, Math.PI * 2);
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 4;
        ctx.stroke();

        // 原有伤害逻辑
        for (let t of this.playground.players) {
            if (t !== p) {
                let dist = p.get_dist(p.x, p.y, t.x, t.y);

                if (dist < 200) {
                    let angle = Math.atan2(t.y - p.y, t.x - p.x);

                    t.is_attacked(angle, this.damage);

                    t.speed *= 0.5;
                    setTimeout(() => t.speed /= 0.5, 1000);
                }
            }
        }

        this.destroy();
    }

    update() {
        this.radius += 500 * this.timedelta / 1000;

        const p = this.player;
        const pos = this.playground.game_map.map_to_viewport(p.x, p.y);
        const ctx = this.playground.game_map.ctx;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,255,0.6)";
        ctx.lineWidth = 5;
        ctx.stroke();

        if (this.radius > 200) {
            this.destroy();
        }
    }
}