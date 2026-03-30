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

        this.character = character;
        this.username = username;

        // ⭐ 1. 机器人随机头像系统
        this.robot_photos = [
            "/static/image/avatar/robot1.png",
            "/static/image/avatar/robot2.png",
            "/static/image/avatar/robot3.png",
            "/static/image/avatar/robot4.png",
            "/static/image/avatar/robot5.png"
        ];

        // ⭐ 2. 如果是机器人，覆盖传入的 photo，随机选一个
        if (this.character === "robot") {
            // 随机生成 0~4 的整数作为索引
            let idx = Math.floor(Math.random() * this.robot_photos.length);
            this.photo = this.robot_photos[idx];
        } else {
            this.photo = photo; // 玩家或NPC使用传入的头像
        }

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
    cast_skill(skill) {
        if (!skill || !skill.class) return;

        console.log("释放技能:", skill.name);

        let tx = this.mouse_x;
        let ty = this.mouse_y;

        // ⭐ 统一用 class 创建技能
        if (skill.class === FireBall) {
            let dx = tx - this.x;
            let dy = ty - this.y;
            let angle = Math.atan2(dy, dx);

            new FireBall(
                this.playground,
                this,
                this.x,
                this.y,
                10,
                Math.cos(angle),
                Math.sin(angle),
                "orange",
                500,
                1000,
                10
            );
        } else if (skill.class === Blink) {
            new Blink(this.playground, this, tx, ty);
        } else if (skill.class === ArrowRain) {
            new ArrowRain(this.playground, this, tx, ty, 20);
        } else if (skill.class === FrostNova) {
            new FrostNova(this.playground, this, 15);
        } else if (skill.class === Whirlwind) {
            new Whirlwind(this.playground, this, 10);
        } else if (skill.class === Execute) {
            new Execute(this.playground, this, 30);
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

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);

        // ⭐ 4. 统一改为图片圆柱剪裁绘制
        if (this.img_loaded) {
            ctx.save();
            ctx.clip(); // 将当前的圆形路径设为剪裁区域

            // 绘制图片，使其中心对准玩家坐标，大小刚好覆盖圆形
            ctx.drawImage(
                this.img,
                pos.x - this.radius,
                pos.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
            ctx.restore(); // 恢复剪裁之前的状态，防止影响后续绘制
        } else {
            // 如果图片还没加载完，先画个底色垫着
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_attacked(angle, damage) {
        if (this.invincible) return;

        console.log("受到伤害:", damage);

        // ✅ 半径变小 = 血量
        this.radius -= damage * 0.3;
        ;

        // ✅ 击退
        this.x += Math.cos(angle) * damage * 0.5;
        this.y += Math.sin(angle) * damage * 0.5;

        // ✅ 粒子特效
        for (let i = 0; i < 10; i++) {
            new Particle(
                this.playground,
                this.x,
                this.y,
                Math.random() * 5,
                Math.cos(angle + Math.random()),
                Math.sin(angle + Math.random()),
                this.color,
                Math.random() * 200,
                Math.random() * 50
            );
        }

        // 💀 死亡判定
        if (this.radius <= 0) {
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