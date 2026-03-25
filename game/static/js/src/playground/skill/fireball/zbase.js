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
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    update() {
        if (this.move_length < this.eps) {
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
        for (const p of this.playground.players) {
            if (this.player !== p && this.is_collision(p)) {
                this.attack(p);
                break;
            }
        }
    }

    is_collision(p) {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius + p.radius;
    }

    attack(p) {
        const angle = Math.atan2(p.y - this.y, p.x - this.x);
        p.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        const s = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * s, this.y * s, this.radius * s, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        const fbs = this.player.fireballs;
        for (let i = 0; i < fbs.length; i++) {
            if (fbs[i] === this) {
                fbs.splice(i, 1);
                break;
            }
        }
    }
}