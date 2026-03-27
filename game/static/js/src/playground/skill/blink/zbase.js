export class Blink extends AcGameObject {
    constructor(playground, player, tx, ty, stun = false, invincible = false) {
        super();
        this.playground = playground;
        this.player = player;

        this.tx = tx;
        this.ty = ty;

        this.max_dist = 400; // 最大闪现距离（像素）
        this.stun = stun;
        this.invincible = invincible;
    }

    start() {
        const p = this.player;

        let dx = this.tx - p.x;
        let dy = this.ty - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        dist = Math.min(dist, this.max_dist);

        const angle = Math.atan2(dy, dx);

        p.x += Math.cos(angle) * dist;
        p.y += Math.sin(angle) * dist;
        p.move_length = 0;

        // 控制效果
        if (this.stun) {
            for (let t of this.playground.players) {
                if (t !== p) {
                    let d = p.get_dist(p.x, p.y, t.x, t.y);
                    if (d < 150) {
                        t.stun = true;
                        setTimeout(() => t.stun = false, 800);
                    }
                }
            }
        }

        if (this.invincible) {
            p.invincible = true;
            setTimeout(() => p.invincible = false, 600);
        }

        this.destroy();
    }
}