export class Execute extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
    }

    start() {
        const p = this.player;

        for (let t of this.playground.players) {
            if (t !== p) {
                let dist = p.get_dist(p.x, p.y, t.x, t.y);

                if (dist < 150) {
                    let real_damage = this.damage * (2 - t.radius / 50);
                    let angle = Math.atan2(t.y - p.y, t.x - p.x);
                    t.is_attacked(angle, real_damage);
                }
            }
        }

        this.destroy();
    }
}