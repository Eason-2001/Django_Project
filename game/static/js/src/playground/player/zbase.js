import { FireBall } from "../skill/fireball/zbase.js";
import { Blink } from "../skill/blink/zbase.js";
import { FrostNova } from "../skill/frostnova/zbase.js";
import { Whirlwind } from "../skill/whirlwind/zbase.js";
import { ArrowRain } from "../skill/arrowrain/zbase.js";
import { Execute } from "../skill/execute/zbase.js";

class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo, hero) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;

        this.hero = hero || { id: 1, avatar: photo };
        this.photo = this.hero.avatar || photo;

        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.fireballs = [];
        this.stun = false;
        this.invincible = false;

        if (this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

        if (this.character === "me") {
            this.init_hero_skills();
        }
    }

    init_hero_skills() {
        this.skill_config = {
            1: [
                { name: "冲锋", coldtime: 5, type: "blink", damage: 0.02, stun: true },
                { name: "旋风斩", coldtime: 7, type: "whirlwind", damage: 0.015 },
                { name: "斩杀", coldtime: 10, type: "execute", damage: 0.03 },
            ],
            2: [
                { name: "火球术", coldtime: 3.5, type: "fireball", damage: 0.02 },
                { name: "冰霜新星", coldtime: 6, type: "nova", damage: 0.018 },
                { name: "闪现", coldtime: 4.5, type: "blink" },
            ],
            3: [
                { name: "精准射击", coldtime: 4, type: "fireball", damage: 0.025, range: 1.5 },
                { name: "箭雨", coldtime: 8, type: "rain", damage: 0.012 },
                { name: "闪避", coldtime: 6, type: "blink", invincible: true },
            ]
        };

        this.skills = this.skill_config[this.hero.id];
        this.skill_coldtimes = [0, 0, 0];
    }

    start() {
        this.playground.player_count++;
        if (this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", () => false);

        this.playground.game_map.$canvas.mousedown(function (e) {
            if (outer.playground.state !== "fighting" || outer.stun) return true;
            if (e.which === 3) {
                const r = outer.ctx.canvas.getBoundingClientRect();
                let tx = (e.clientX - r.left) / outer.playground.scale;
                let ty = (e.clientY - r.top) / outer.playground.scale;
                outer.move_to(tx, ty);
            }
        });

        this.playground.game_map.$canvas.keydown(function (e) {
            if (e.which === 13) { outer.playground.chat_field?.show_input(); return false; }
            if (e.which === 27) { outer.playground.chat_field?.hide_input(); return true; }
            if (outer.playground.state !== "fighting" || outer.stun) return true;

            const r = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - r.left) / outer.playground.scale;
            let ty = (e.clientY - r.top) / outer.playground.scale;

            if (e.which === 81 && outer.skill_coldtimes[0] < 0.1) outer.use_hero_skill(0, tx, ty);
            if (e.which === 87 && outer.skill_coldtimes[1] < 0.1) outer.use_hero_skill(1, tx, ty);
            if (e.which === 69 && outer.skill_coldtimes[2] < 0.1) outer.use_hero_skill(2, tx, ty);
        });
    }

    use_hero_skill(idx, tx, ty) {
        const s = this.skills[idx];
        this.skill_coldtimes[idx] = s.coldtime;

        switch (s.type) {
            case "blink": new Blink(this.playground, this, tx, ty, s.stun, s.invincible); break;
            case "fireball": this.shoot_fireball(tx, ty, s.damage, s.range); break;
            case "nova": new FrostNova(this.playground, this, s.damage); break;
            case "whirlwind": new Whirlwind(this.playground, this, s.damage); break;
            case "rain": new ArrowRain(this.playground, this, tx, ty, s.damage); break;
            case "execute": new Execute(this.playground, this, s.damage); break;
        }
    }

    shoot_fireball(tx, ty, damage, range = 1) {
        const a = Math.atan2(ty - this.y, tx - this.x);
        new FireBall(
            this.playground, this,
            this.x, this.y, 0.01,
            Math.cos(a), Math.sin(a),
            "orange", 0.6, range, damage
        );
    }

    get_dist(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        const a = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(a);
        this.vy = Math.sin(a);
    }

    is_attacked(angle, damage) {
        if (this.invincible) return;
        for (let i = 0; i < 25; i++) {
            const r = this.radius * Math.random();
            const a = Math.random() * Math.PI * 2;
            const x = this.x + r * Math.cos(a);
            const y = this.y + r * Math.sin(a);
            new Particle(this.playground, x, y, this.color, this.speed);
        }
        this.radius -= damage;
        if (this.radius < this.eps) {
            this.destroy();
            return;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = 20;
        this.speed *= 0.8;
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if (this.character === "me" && this.playground.state === "fighting") this.update_coldtime();
        this.update_move();
        this.render();
    }

    update_coldtime() {
        for (let i = 0; i < 3; i++) {
            this.skill_coldtimes[i] -= this.timedelta / 1000;
            this.skill_coldtimes[i] = Math.max(this.skill_coldtimes[i], 0);
        }
    }

    update_move() {
        if (this.stun) { this.vx = this.vy = 0; this.move_length = 0; return; }

        if (this.character === "robot" && this.spent_time > 4 && Math.random() < 1 / 900) {
            const t = this.playground.players.filter(p => p !== this)[0];
            if (t) this.use_hero_skill(Math.floor(Math.random() * 3), t.x, t.y);
        }

        if (this.damage_speed > this.eps) {
            this.damage_speed *= this.friction;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            return;
        }

        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
            if (this.character === "robot") {
                this.move_to(Math.random(), Math.random());
            }
            return;
        }

        const moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    render() {
        const s = this.playground.scale;
        if (this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * s, this.y * s, this.radius * s, 0, Math.PI * 2);
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * s, (this.y - this.radius) * s, this.radius * 2 * s, this.radius * 2 * s);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * s, this.y * s, this.radius * s, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
}