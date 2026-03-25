export class Execute extends AcGameObject {
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
            if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 0.15) {
                const real = this.damage * (2 - t.radius / 0.05);
                t.is_attacked(Math.atan2(p.y - t.y, p.x - t.x), real);
            }
        });
        this.destroy();
    }
}