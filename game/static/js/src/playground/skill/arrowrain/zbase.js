export class ArrowRain extends AcGameObject {
    constructor(playground, player, tx, ty, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.damage = damage;
        this.counter = 0;
    }

    update() {
        if (this.counter++ > 8) {
            this.destroy();
            return;
        }
        this.playground.players.forEach(p => {
            if (this.player.get_dist(this.tx, this.ty, p.x, p.y) < 0.25) {
                p.is_attacked(Math.random() * Math.PI * 2, this.damage / 3);
            }
        });
    }
}