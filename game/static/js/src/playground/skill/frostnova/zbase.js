export class FrostNova extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
        this.start();
    }

    start() {
        const p = this.player;
        this.playground.players.forEach(t => {
            if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 0.25) {
                t.is_attacked(Math.atan2(p.y - t.y, p.x - t.x), this.damage);
                t.speed *= 0.5;
                setTimeout(() => t.speed /= 0.5, 1000);
            }
        });
        this.destroy();
    }
}