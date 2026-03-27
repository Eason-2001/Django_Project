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

        this.photo = photo;

        this.mouse_x = this.x;
        this.mouse_y = this.y;

        if (this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
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
    }

    add_listening_events() {


        const canvas = this.playground.game_map.$canvas;
        const outer = this;

        canvas.mousedown(function () {
            canvas.focus();
        });

        // 禁止右键菜单
        canvas.on("contextmenu", e => e.preventDefault());

        canvas.keydown(function (e) {
            if (e.which === 81) { // Q
                let skill = outer.hero.skills[0];
                console.log("释放", skill.name);
            }
            if (e.which === 87) { // W
                let skill = outer.hero.skills[1];
            }
            if (e.which === 69) { // E
                let skill = outer.hero.skills[2];
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
            return;
        }

        const moved = Math.min(
            this.move_length,
            this.speed * this.timedelta / 1000
        );

        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update() {
        this.update_move();
        this.render();
    }

    render() {
        const gm = this.playground.game_map;
        const ctx = this.ctx;
        const scale = this.playground.scale || 1;

        const pos = gm.map_to_viewport(this.x, this.y);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);

        if (this.character !== "robot") {
            ctx.save();
            ctx.clip();
            ctx.drawImage(
                this.img,
                pos.x - this.radius,
                pos.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
            ctx.restore();
        } else {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
}