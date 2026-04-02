class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo, hero) {
        super();

        this.playground = playground;
        this.hero = hero;
        this.ctx = this.playground.game_map.ctx;

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.max_hp = 300;
        this.hp = 300;

        this.character = character;
        this.username = username;

        this.invincible = false;
        this.photo = photo;
        this.skill_cds = {};  // 技能冷却表

        this.mouse_x = this.x;
        this.mouse_y = this.y;

        // ⭐ 3. 统一创建 Image 对象，不论是谁
        this.img = new Image();
        this.img.src = this.photo;

        // 增加一个标记，确保图片加载完再画
        this.img_loaded = false;
        let outer = this;
        this.img.onload = function () {
            outer.img_loaded = true;
        }
    }

    start() {
        this.playground.player_count++;

        if (this.character === "me") {
            this.add_listening_events();
        }

        if (this.playground.player_count >= 1) {
            this.playground.state = "fighting";
        }

        if (this.character === "robot") {
            this.set_random_move();
            this.set_random_skill();
        }
    }

    add_listening_events() {
        const canvas = this.playground.game_map.$canvas;
        const outer = this;

        // 点击canvas获取焦点（保证能按键）
        canvas.mousedown(function () {
            canvas.focus();
        });

        // 禁止右键菜单
        canvas.on("contextmenu", e => e.preventDefault());

        // 🎮 键盘技能释放（已修复）
        canvas.keydown(function (e) {
            if (outer.playground.state !== "fighting") return;

            if (e.which === 81) { // Q
                outer.cast_skill(outer.hero.skills[0]);
            }
            if (e.which === 87) { // W
                outer.cast_skill(outer.hero.skills[1]);
            }
            if (e.which === 69) { // E
                outer.cast_skill(outer.hero.skills[2]);
            }
        });

        // 鼠标移动（转世界坐标）
        canvas.mousemove(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();

            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;

            outer.mouse_x = sx + outer.playground.game_map.viewport_x;
            outer.mouse_y = sy + outer.playground.game_map.viewport_y;
        });

        // 右键移动
        canvas.mousedown(function (e) {
            if (outer.playground.state !== "fighting") return;

            if (e.button === 2) {
                const rect = outer.ctx.canvas.getBoundingClientRect();

                const sx = e.clientX - rect.left;
                const sy = e.clientY - rect.top;

                const tx = sx + outer.playground.game_map.viewport_x;
                const ty = sy + outer.playground.game_map.viewport_y;

                outer.move_to(tx, ty);
            }
        });
    }

    // 🔥 核心：技能释放系统
    // 🔥 核心：技能释放系统（已修复所有BUG）
    // 🔥 最终修复版：技能释放系统
cast_skill(skill) {
    if (!skill || !skill.class) return;

    let now = Date.now();
    // 冷却判断
    if (this.skill_cds[skill.name] && now < this.skill_cds[skill.name]) {
        return;
    }
    this.skill_cds[skill.name] = now + skill.cooldown * 1000;

    let tx = this.mouse_x;
    let ty = this.mouse_y;
    let dx = tx - this.x;
    let dy = ty - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    // ⭐ 修复1：range 单位换算（配置是比例，转成像素）
    const RANGE_SCALE = 1000;
    let real_range = skill.range * RANGE_SCALE;

    // ⭐ 修复2：只有攻击技能限制距离，位移技能不限制
    if (skill.type !== "movement" && skill.type !== "defense" && skill.type !== "control" && dist > real_range) {
        tx = this.x + dx / dist * real_range;
        ty = this.y + dy / dist * real_range;
    }

    // === 所有技能释放逻辑 ===
    // 火球/精准射击
    if (skill.class === FireBall) {
        let angle = Math.atan2(dy, dx);
        new FireBall(
            this.playground, this, this.x, this.y, 10,
            Math.cos(angle), Math.sin(angle), "orange",
            500, real_range, skill.damage
        );
    }

    // 闪现/冲锋/闪避（全修复）
    if (skill.class === Blink) {
        let stun = skill.type === "control"; // 冲锋=眩晕
        let invincible = skill.type === "defense"; // 闪避=无敌
        new Blink(this.playground, this, tx, ty, stun, invincible);
    }

    // 冰霜新星
    if (skill.class === FrostNova) {
        new FrostNova(this.playground, this, skill.damage);
    }

    // 旋风斩
    if (skill.class === Whirlwind) {
        new Whirlwind(this.playground, this, skill.damage);
    }

    // 斩杀
    if (skill.class === Execute) {
        new Execute(this.playground, this, skill.damage);
    }

    // 箭雨
    if (skill.class === ArrowRain) {
        new ArrowRain(this.playground, this, tx, ty, skill.damage);
    }
}
    move_to(tx, ty) {
        const dx = tx - this.x;
        const dy = ty - this.y;

        this.move_length = Math.sqrt(dx * dx + dy * dy);

        const angle = Math.atan2(dy, dx);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update_move() {
        if (this.move_length < 1) {
            this.move_length = 0;
            // 如果是人机且停下了，给它一个新的随机目标，防止原地发呆
            if (this.character === "robot") {
                this.move_to(Math.random() * this.playground.game_map.map_width,
                    Math.random() * this.playground.game_map.map_height);
            }
            return;
        }

        const moved = Math.min(
            this.move_length,
            this.speed * this.timedelta / 1000
        );

        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        // ⭐ 边缘反弹逻辑：如果撞墙了，立刻换方向
        let margin = 5; // 距离边界 5 像素就触发反弹
        let map_w = this.playground.game_map.map_width;
        let map_h = this.playground.game_map.map_height;

        if (this.x <= margin || this.x >= map_w - margin) {
            this.vx *= -1; // 水平反弹
            this.move_length += 100; // 撞墙后多给点移动距离，防止卡在边缘
        }
        if (this.y <= margin || this.y >= map_h - margin) {
            this.vy *= -1; // 垂直反弹
            this.move_length += 100;
        }

        // 最终硬性物理限制（防止穿模）
        this.x = Math.max(0, Math.min(this.x, map_w));
        this.y = Math.max(0, Math.min(this.y, map_h));
    }

    update() {
        this.update_move();
        this.render();
    }

    render() {
        const gm = this.playground.game_map;
        const ctx = this.ctx;

        const pos = gm.map_to_viewport(this.x, this.y);

        ctx.save();

        // ⭐ 圆形裁剪
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.clip();

        if (this.img_loaded) {
            ctx.drawImage(
                this.img,
                pos.x - this.radius,
                pos.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
        } else {
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        ctx.restore();

        // ⭐ 血条
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x - this.radius, pos.y - this.radius - 10, this.radius * 2, 5);

        ctx.fillStyle = "green";
        ctx.fillRect(
            pos.x - this.radius,
            pos.y - this.radius - 10,
            this.radius * 2 * (this.hp / this.max_hp),
            5
        );
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_attacked(angle, damage) {
        if (this.invincible) return;

        this.hp -= damage;

        this.x += Math.cos(angle) * damage * 0.5;
        this.y += Math.sin(angle) * damage * 0.5;
        this.playground.game_map.viewport_x += Math.random() * 10 - 5;
        this.playground.game_map.viewport_y += Math.random() * 10 - 5;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    on_destroy() {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i++) {
            if (players[i] === this) {
                players.splice(i, 1);
                break;
            }
        }
    }

    set_random_move() {
        let outer = this;

        // 初始随机方向
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;

        setInterval(function () {
            if (outer.playground.state !== "fighting") return;

            // ⭐ 小幅改变方向（关键！）
            outer.vx += (Math.random() * 2 - 1) * 0.3;
            outer.vy += (Math.random() * 2 - 1) * 0.3;

            // 归一化（防止速度爆炸）
            let len = Math.sqrt(outer.vx * outer.vx + outer.vy * outer.vy);
            if (len > 0) {
                outer.vx /= len;
                outer.vy /= len;
            }

            // ⭐ 持续移动
            outer.move_length = 100; // 一小段距离

        }, 200); // 每0.2秒微调一次
    }

    set_random_skill() {
        let outer = this;

        let delay = 3000 + Math.random() * 3000; // 3~6秒

        setTimeout(function () {

            if (outer.playground.state !== "fighting") return;

            // ⭐ 找最近敌人
            let target = outer.find_target();

            if (target) {
                outer.mouse_x = target.x;
                outer.mouse_y = target.y;

                // ⭐ 随机技能
                let skills = outer.hero.skills;
                let skill = skills[Math.floor(Math.random() * skills.length)];

                outer.cast_skill(skill);
            }

            // 🔁 递归继续放技能
            outer.set_random_skill();

        }, delay);
    }

    find_target() {
        let min_dist = Infinity;
        let target = null;

        for (let p of this.playground.players) {
            if (p !== this) {
                let dx = this.x - p.x;
                let dy = this.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < min_dist) {
                    min_dist = dist;
                    target = p;
                }
            }
        }

        return target;
    }

}