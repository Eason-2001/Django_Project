export class ArrowRain extends AcGameObject {
    constructor(playground, player, tx, ty, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.damage = damage;

        this.radius = 200;   // 攻击范围（像素）
        this.duration = 400; // 持续时间(ms)
        this.elapsed = 0;
    }

    update() {
        this.elapsed += this.timedelta;

        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        for (let p of this.playground.players) {
            if (p !== this.player) {
                let dx = p.x - this.tx;
                let dy = p.y - this.ty;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.radius) {
                    p.is_attacked(Math.random() * Math.PI * 2, this.damage);
                }
            }
        }
    }
}