export class Blink extends AcGameObject {
    constructor(playground, player, tx, ty, stun = false, invincible = false) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.max_dist = 800; // 大幅增加闪现距离，解决放不出来问题
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

        // 位移
        p.x += Math.cos(angle) * dist;
        p.y += Math.sin(angle) * dist;

        // ⭐ 冲锋：眩晕敌人
        if (this.stun) {
            for (let t of this.playground.players) {
                if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 200) {
                    t.speed = 0;
                    setTimeout(() => t.speed = 300, 1000); // 晕1秒
                }
            }
        }

        // ⭐ 闪避：无敌
        if (this.invincible) {
            p.invincible = true;
            setTimeout(() => p.invincible = false, 500); // 0.5秒免伤
        }

        // 粒子特效
        for (let i = 0; i < 10; i++) {
            new Particle(this.playground, p.x, p.y, 3, Math.random()*2-1, Math.random()*2-1, "cyan", 200, 30);
        }

        this.destroy();
    }
}