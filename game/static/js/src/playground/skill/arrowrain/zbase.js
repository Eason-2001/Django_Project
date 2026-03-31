export class ArrowRain extends AcGameObject {
    constructor(playground, player, tx, ty, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.damage = damage;

        this.radius = 200;
        this.duration = 400;
        this.elapsed = 0;
        this.has_hit = false;
    }

    update() {
        this.elapsed += this.timedelta;
        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        if (!this.has_hit) {
            this.has_hit = true;
            for (let p of this.playground.players) {
                if (p === this.player) continue;
                let dist = Math.hypot(p.x - this.tx, p.y - this.ty);
                if (dist < this.radius) {
                    p.is_attacked(Math.random() * Math.PI * 2, this.damage);
                }
            }
        }
    }
}