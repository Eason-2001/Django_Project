export class Blink extends AcGameObject {
    constructor(playground, player, tx, ty, stun = false, invincible = false) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.stun = stun;
        this.invincible = invincible;
        this.start();
    }

    start() {
        const p = this.player;
        let d = p.get_dist(p.x, p.y, this.tx, this.ty);
        d = Math.min(d, 0.8);
        const a = Math.atan2(this.ty - p.y, this.tx - p.x);
        p.x += d * Math.cos(a);
        p.y += d * Math.sin(a);
        p.move_length = 0;

        if (this.stun) {
            this.playground.players.forEach(t => {
                if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 0.2) {
                    t.stun = true;
                    setTimeout(() => t.stun = false, 800);
                }
            });
        }

        if (this.invincible) {
            p.invincible = true;
            setTimeout(() => p.invincible = false, 600);
        }

        this.destroy();
    }
}