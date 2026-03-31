export class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();

        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.radius = radius;
        this.color = color;

        this.speed = speed;           // 像素/秒
        this.move_length = move_length; // 最大距离（像素）

        this.damage = damage;
    }

    update() {
        if (this.move_length <= 0) {
            this.destroy();
            return;
        }

        this.update_move();
        this.update_attack();
        this.render();
    }

    update_move() {
        const moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);

        this.x += this.vx * moved;
        this.y += this.vy * moved;

        this.move_length -= moved;
    }

    update_attack() {
        for (let p of this.playground.players) {
            if (p !== this.player) {
                let dx = this.x - p.x;
                let dy = this.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.radius + p.radius) {
                    this.attack(p);
                    break;
                }
            }
        }
    }

    attack(p) {
        for (let i = 0; i < 15; i++) {
            new Particle(
                this.playground,
                p.x,
                p.y,
                Math.random() * 5,
                Math.cos(Math.random() * 2 * Math.PI),
                Math.sin(Math.random() * 2 * Math.PI),
                "orange",
                300,
                50
            );
        }
        let angle = Math.atan2(p.y - this.y, p.x - this.x);
        p.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        const gm = this.playground.game_map;
        const pos = gm.map_to_viewport(this.x, this.y);

        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}