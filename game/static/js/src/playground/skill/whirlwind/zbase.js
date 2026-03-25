export class Whirlwind extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
        this.counter = 0;
    }

    update() {
        if (this.counter++ > 5) {
            this.destroy();
            return;
        }
        const p = this.player;
        this.playground.players.forEach(t => {
            if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 0.3) {
                t.is_attacked(Math.random() * Math.PI * 2, this.damage);
            }
        });
    }
}