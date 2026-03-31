export class Whirlwind extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
        this.duration = 300;
        this.elapsed = 0;
        this.has_hit = false;
    }

    update() {
        this.elapsed += this.timedelta;
        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        const p = this.player;
        let pos = this.playground.game_map.map_to_viewport(p.x, p.y);
        this.playground.game_map.ctx.beginPath();
        this.playground.game_map.ctx.arc(pos.x, pos.y, 180, 0, Math.PI * 2);
        this.playground.game_map.ctx.strokeStyle = "rgba(255,255,255,0.3)";
        this.playground.game_map.ctx.stroke();

        if (!this.has_hit) {
            this.has_hit = true;
            for (let t of this.playground.players) {
                if (t !== p) {
                    let dist = p.get_dist(p.x, p.y, t.x, t.y);
                    if (dist < 180) {
                        t.is_attacked(Math.random() * Math.PI * 2, this.damage);
                    }
                }
            }
        }
    }
}