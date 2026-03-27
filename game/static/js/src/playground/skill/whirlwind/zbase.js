export class Whirlwind extends AcGameObject {
    constructor(playground, player, damage) {
        super();

        this.playground = playground;
        this.player = player;
        this.damage = damage;

        this.duration = 300; // ms
        this.elapsed = 0;
    }

    update() {
        this.elapsed += this.timedelta;

        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        const p = this.player;

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