
class AcHeroSelect {
    constructor(root) {
        this.root = root;

        this.heroes = [
            {
                id: 1,
                name: "武僧马嘉祺",
                avatar: "/static/image/menu/majiaqi.jpg",
                desc: "近战控制型战士",
                skills: [
                    {
                        key: "Q",
                        name: "冲锋",
                        desc: "快速冲向敌人并造成眩晕",
                        icon: "/static/image/skills/blink.png",
                        class: Blink,
                        damage: 10,
                        cooldown: 5,
                        range: 0.8,
                        type: "control"
                    },
                    {
                        key: "W",
                        name: "旋风斩",
                        desc: "旋转攻击周围所有敌人",
                        icon: "/static/image/skills/whirlwind.png",
                        class: Whirlwind,
                        damage: 25,
                        cooldown: 6,
                        range: 0.5,
                        type: "aoe"
                    },
                    {
                        key: "E",
                        name: "斩杀",
                        desc: "对低血量敌人造成真实伤害",
                        icon: "/static/image/skills/execute.png",
                        class: Execute,
                        damage: 40,
                        cooldown: 8,
                        range: 0.6,
                        type: "execute"
                    }
                ]
            },

            {
                id: 2,
                name: "邪恶小明睿",
                avatar: "/static/image/menu/mingrui.jpg",
                desc: "远程法师",
                skills: [
                    {
                        key: "Q",
                        name: "火球术",
                        desc: "发射火球造成范围伤害",
                        icon: "/static/image/skills/fireball.png",
                        class: FireBall,
                        damage: 30,
                        cooldown: 3,
                        speed: 0.7,
                        range: 1.2,
                        type: "skillshot"
                    },
                    {
                        key: "W",
                        name: "冰霜新星",
                        desc: "冻结周围敌人并减速",
                        icon: "/static/image/skills/frost.png",
                        class: FrostNova,
                        damage: 15,
                        cooldown: 6,
                        range: 0.6,
                        type: "aoe_control"
                    },
                    {
                        key: "E",
                        name: "闪现",
                        desc: "瞬间位移到指定位置",
                        icon: "/static/image/skills/blink.png",
                        class: Blink,
                        damage: 0,
                        cooldown: 8,
                        range: 0.8,
                        type: "movement"
                    }
                ]
            },

            {
                id: 3,
                name: "老炮手佳批",
                avatar: "/static/image/menu/chengjia.jpg",
                desc: "远程爆发射手",
                skills: [
                    {
                        key: "Q",
                        name: "精准射击",
                        desc: "对单个目标造成高额伤害",
                        icon: "/static/image/skills/sniper.png",
                        class: FireBall,
                        damage: 45,
                        cooldown: 4,
                        range: 1.5,
                        type: "single"
                    },
                    {
                        key: "W",
                        name: "箭雨",
                        desc: "范围持续伤害",
                        icon: "/static/image/skills/rain.png",
                        class: ArrowRain,
                        damage: 20,
                        cooldown: 7,
                        range: 1.0,
                        type: "aoe"
                    },
                    {
                        key: "E",
                        name: "闪避",
                        desc: "免疫伤害并位移",
                        icon: "/static/image/skills/dodge.png",
                        class: Blink,
                        damage: 0,
                        cooldown: 6,
                        range: 0.7,
                        type: "defense"
                    }
                ]
            }
        ];

        this.current_idx = 0;

        this.$hero_select = $(`
            <div class="ac-game-hero-total">
                <div class="ac-game-hero-select">
                    <div class="ac-game-hero-select-title">选择你的英雄</div>
                    
                    <div class="ac-game-hero-name"></div>
    
                    <div class="ac-game-hero-select-container">
                        <div class="ac-game-hero-select-arrow-left"><</div>
                        <div class="ac-game-hero-select-image"></div>
                        <div class="ac-game-hero-select-arrow-right">></div>
                    </div>
    
                    <div class="ac-game-hero-select-skills"></div>
                    <button class="ac-game-hero-select-btn">确定</button>
                </div>
            </div>
        `);

        this.$hero_select.hide();
        this.root.$ac_game.append(this.$hero_select);

        this.$confirm_btn = this.$hero_select.find('.ac-game-hero-select-btn');
        this.$arrow_left = this.$hero_select.find('.ac-game-hero-select-arrow-left');
        this.$arrow_right = this.$hero_select.find('.ac-game-hero-select-arrow-right');
        this.$hero_image = this.$hero_select.find('.ac-game-hero-select-image');
        this.$hero_name = this.$hero_select.find('.ac-game-hero-name');
        this.$skills_container = this.$hero_select.find('.ac-game-hero-select-skills');

        this.start();
        this.render();
    }

    start() {
        this.add_listening_events();
    }

    render() {
        const hero = this.heroes[this.current_idx];

        this.$hero_image.css({
            "background-image": `url(${hero.avatar})`,
            "background-size": "cover",
            "background-position": "center"
        });

        this.$hero_name.text(hero.name);

        let skills_html = "";
        for (let skill of hero.skills) {
            skills_html += `
                <div class="ac-game-hero-skill">
                    <div class="ac-game-hero-skill-name">${skill.name}</div>
                    <div class="ac-game-hero-skill-desc">${skill.desc}</div>
                </div>
            `;
        }
        this.$skills_container.html(skills_html);
    }

    add_listening_events() {
        let outer = this;

        this.$confirm_btn.click(function () {
            outer.hide();

            // ⭐ 关键：传整个 hero（带 class）
            outer.root.playground.show("single mode", outer.heroes[outer.current_idx]);
        });

        this.$arrow_left.click(function () {
            outer.current_idx = (outer.current_idx - 1 + outer.heroes.length) % outer.heroes.length;
            outer.render();
        });

        this.$arrow_right.click(function () {
            outer.current_idx = (outer.current_idx + 1) % outer.heroes.length;
            outer.render();
        });
    }

    show() {
        this.$hero_select.show();
    }

    hide() {
        this.$hero_select.hide();
    }
}class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
    <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
            单人模式
    </div>
    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
            多人模式
    </div>
    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
    </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.hero.show()

        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode")
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();

        });
    }

    show(){ //显示menu界面
        this.$menu.show();
    }

    hide(){  //关闭menu界面
        this.$menu.hide();
    }

}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    late_update() {  // 在每一帧的最后执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="ac-game-chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;

        this.$input.keydown(function(e) {
            if (e.which === 27) {  // ESC
                outer.hide_input();
                return false;
            } else if (e.which === 13) {  // ENTER
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
                }
                return false;
            }
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function() {
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }

    show_input() {
        this.show_history();

        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

        // 世界地图大小 (5000x5000)
        this.map_width = 5000;
        this.map_height = 5000;

        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;

        this.viewport_x = 0;
        this.viewport_y = 0;

        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;

        this.playground.$playground.append(this.$canvas);

        // ⭐ 优化：生成 300 颗随机星星
        this.stars = [];
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: Math.random() * this.viewport_width,  // 初始分布在当前屏幕
                y: Math.random() * this.viewport_height, // 初始分布在当前屏幕
                radius: Math.random() * 1.5 + 0.5,       // 星星大小 0.5~2px
                speed_factor: Math.random() * 0.3 + 0.2, // ⭐ 关键：每颗星移动速度不同，更有层次感
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
            });
        }
    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.viewport_width = this.playground.width;
        this.viewport_height = this.playground.height;

        this.ctx.canvas.width = this.viewport_width;
        this.ctx.canvas.height = this.viewport_height;
    }

    // 世界坐标转视口坐标 (用于画边界线和玩家)
    map_to_viewport(x, y) {
        return {
            x: x - this.viewport_x,
            y: y - this.viewport_y
        };
    }

    update_viewport(target) {
        if (!target) return;

        // 让视角中心对准目标玩家
        this.viewport_x = target.x - this.viewport_width / 2;
        this.viewport_y = target.y - this.viewport_height / 2;

        // 限制视角不超出 5000x5000 的世界地图边缘
        this.viewport_x = Math.max(0, Math.min(this.viewport_x, this.map_width - this.viewport_width));
        this.viewport_y = Math.max(0, Math.min(this.viewport_y, this.map_height - this.viewport_height));
    }

    // ⭐ 核心优化：带视差滚动的星星渲染
    render_stars() {
        for (let star of this.stars) {
            // 根据视口偏移和星星自身的速率系数计算绘制位置
            // 使用取模 (%) 运算确保星星在屏幕边缘消失后从另一侧冒出来（无限循环背景）
            let x = (star.x - this.viewport_x * star.speed_factor) % this.viewport_width;
            let y = (star.y - this.viewport_y * star.speed_factor) % this.viewport_height;

            // 处理取模后的负数情况，确保坐标永远在视口内
            if (x < 0) x += this.viewport_width;
            if (y < 0) y += this.viewport_height;

            this.ctx.beginPath();
            this.ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.fill();
        }
    }

    render() {
        // 1. 清理画布
        this.ctx.clearRect(0, 0, this.viewport_width, this.viewport_height);

        // 2. 绘制黑色宇宙背景
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.viewport_width, this.viewport_height);

        // 3. 绘制会滚动的星星
        this.render_stars();

        // 4. 绘制世界地图的白色边界线 (5000x5000 的大框)
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 4;
        let border = this.map_to_viewport(0, 0);
        this.ctx.strokeRect(border.x, border.y, this.map_width, this.map_height);
    }

    update() {
        // 锁定视角到“我”这个玩家
        let me = null;
        for (let p of this.playground.players) {
            if (p.character === "me") {
                me = p;
                break;
            }
        }

        if (me) {
            this.update_viewport(me);
        } else if (this.playground.players.length > 0) {
            this.update_viewport(this.playground.players[0]);
        }

        this.render();
    }
}class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.width = 200;
        this.height = 200;

        this.$canvas = $(`<canvas class="mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');

        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.playground.$playground.append(this.$canvas);

        // ⭐ 核心修复：强制重置 CSS 样式，确保在右下角且不被居中规则干扰
        this.$canvas.css({
            "position": "absolute",
            "bottom": "20px",
            "right": "20px",
            "top": "auto",
            "left": "auto",
            "transform": "none",
            "background": "rgba(0,0,0,0.5)",
            "border": "2px solid white",
            "z-index": "1000" // 确保在最顶层
        });
    }

    update() {
        this.render();
    }

    render() {
        const map = this.playground.game_map;
        if (!map) return;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. 绘制半透明黑色背景
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. 绘制玩家点
        for (let p of this.playground.players) {
            // 计算玩家在小地图上的比例坐标
            let x = (p.x / map.map_width) * this.width;
            let y = (p.y / map.map_height) * this.height;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);

            if (p.character === "me") {
                ctx.fillStyle = "#00FF00"; // 自己显示为亮绿色
            } else {
                ctx.fillStyle = "#FF0000"; // 敌人显示为红色
            }
            ctx.fill();
        }

        // 3. 绘制黄色视野框（代表当前屏幕在世界地图的哪个位置）
        let vx = (map.viewport_x / map.map_width) * this.width;
        let vy = (map.viewport_y / map.map_height) * this.height;
        let vw = (map.viewport_width / map.map_width) * this.width;
        let vh = (map.viewport_height / map.map_height) * this.height;

        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vx, vy, vw, vh);
    }
}class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
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
        this.max_hp = 100;
        this.hp = 100;

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

}class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win: 胜利，lose：失败

        this.win_img = new Image();
        this.win_img.src = "https://app165.acapp.acwing.com.cn/static/image/playground/win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://app165.acapp.acwing.com.cn/static/image/playground/lose.png";
    }

    start() {
    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function() {
            outer.playground.hide();
            outer.playground.root.menu.show();
        });
    }

    win() {
        this.state = "win";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    late_update() {
        this.render();
    }

    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
export class ArrowRain extends AcGameObject {
    constructor(playground, player, tx, ty, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.damage = damage;

        this.radius = 200;
        this.duration = 400;
        this.elapsed = 0;

        // 记录这波箭雨已经打到谁，防止重复伤害
        this.hit = new Set();
    }

    update() {
        this.elapsed += this.timedelta;

        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        for (let p of this.playground.players) {
            if (p === this.player) continue;
            if (this.hit.has(p)) continue; // 每个人只中一次

            let dist = Math.hypot(p.x - this.tx, p.y - this.ty);
            if (dist < this.radius) {
                this.hit.add(p); // 标记已击中
                p.is_attacked(Math.random() * Math.PI * 2, this.damage);
            }
        }
    }
}export class Blink extends AcGameObject {
    constructor(playground, player, tx, ty, stun = false, invincible = false) {
        super();
        this.playground = playground;
        this.player = player;
        this.tx = tx;
        this.ty = ty;
        this.max_dist = 800; // 大幅增加闪现距离，解决放不出来问题
        this.stun = stun;
        this.invincible = invincible;
    }

    start() {
        const p = this.player;
        let dx = this.tx - p.x;
        let dy = this.ty - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        dist = Math.min(dist, this.max_dist);
        const angle = Math.atan2(dy, dx);

        // 位移
        p.x += Math.cos(angle) * dist;
        p.y += Math.sin(angle) * dist;

        // ⭐ 冲锋：眩晕敌人
        if (this.stun) {
            for (let t of this.playground.players) {
                if (t !== p && p.get_dist(p.x, p.y, t.x, t.y) < 200) {
                    t.speed = 0;
                    setTimeout(() => t.speed = 300, 1000); // 晕1秒
                }
            }
        }

        // ⭐ 闪避：无敌
        if (this.invincible) {
            p.invincible = true;
            setTimeout(() => p.invincible = false, 500); // 0.5秒免伤
        }

        // 粒子特效
        for (let i = 0; i < 10; i++) {
            new Particle(this.playground, p.x, p.y, 3, Math.random()*2-1, Math.random()*2-1, "cyan", 200, 30);
        }

        this.destroy();
    }
}export class Execute extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
    }

    start() {
        const p = this.player;

        for (let t of this.playground.players) {
            if (t !== p) {
                let dist = p.get_dist(p.x, p.y, t.x, t.y);

                if (dist < 150) {
                    let real_damage = this.damage * (2 - t.radius / 50);
                    let angle = Math.atan2(t.y - p.y, t.x - p.x);
                    t.is_attacked(angle, real_damage);
                }
            }
        }

        this.destroy();
    }
}export class FireBall extends AcGameObject {
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
}export class FrostNova extends AcGameObject {
    constructor(playground, player, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.damage = damage;
        this.radius = 0;
    }

    start() {
        const p = this.player;

        // ⭐ 获取屏幕坐标
        const pos = this.playground.game_map.map_to_viewport(p.x, p.y);

        // ⭐ 画冰环
        const ctx = this.playground.game_map.ctx;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 200, 0, Math.PI * 2);
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 4;
        ctx.stroke();

        // 原有伤害逻辑
        for (let t of this.playground.players) {
            if (t !== p) {
                let dist = p.get_dist(p.x, p.y, t.x, t.y);

                if (dist < 200) {
                    let angle = Math.atan2(t.y - p.y, t.x - p.x);

                    t.is_attacked(angle, this.damage);

                    t.speed *= 0.5;
                    setTimeout(() => t.speed /= 0.5, 1000);
                }
            }
        }

        this.destroy();
    }

    update() {
        this.radius += 500 * this.timedelta / 1000;

        const p = this.player;
        const pos = this.playground.game_map.map_to_viewport(p.x, p.y);
        const ctx = this.playground.game_map.ctx;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,255,0.6)";
        ctx.lineWidth = 5;
        ctx.stroke();

        if (this.radius > 200) {
            this.destroy();
        }
    }
}export class Whirlwind extends AcGameObject {
    constructor(playground, player, damage) {
        super();

        this.playground = playground;
        this.player = player;
        this.damage = damage;

        this.duration = 300; // ms
        this.elapsed = 0;
        this.has_damaged = false; // 👈 加个标记，只打一次
    }

    update() {
        this.elapsed += this.timedelta;

        if (this.elapsed > this.duration) {
            this.destroy();
            return;
        }

        const p = this.player;
        let pos = this.playground.game_map.map_to_viewport(p.x, p.y);

        this.playground.game_map.ctx.beginPath();
        this.playground.game_map.ctx.arc(pos.x, pos.y, 180, 0, Math.PI * 2);
        this.playground.game_map.ctx.strokeStyle = "rgba(255,255,255,0.3)";
        this.playground.game_map.ctx.stroke();

        // 👇 只在第一次执行伤害！！！
        if (!this.has_damaged) {
            this.has_damaged = true; // 只打一次

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
}// 继承 AcGameObject，加入游戏主循环，每帧自动更新！
class SkillUI extends AcGameObject {
    constructor(playground) {
        super(); // 必须加！启用主循环
        this.playground = playground;
        this.$container = $(`<div class="skill-ui"></div>`);
        this.playground.$playground.append(this.$container);
        this.render();
    }

    render() {
        let hero = this.playground.hero;
        let html = "";
        for (let i = 0; i < hero.skills.length; i++) {
            let skill = hero.skills[i];
            html += `
                <div class="skill-item">
                    <div class="skill-key">${['Q', 'W', 'E'][i]}</div>
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-cd-mask"></div> 
                </div>
            `;
        }
        this.$container.html(html);
    }

    // 🔥 核心：每帧自动执行，冷却遮罩实时更新
    update() {
        // 确保玩家存在
        if(!this.playground.players || this.playground.players.length === 0) return;

        let now = Date.now();
        this.$container.find('.skill-item').each((i, el) => {
            let skill = this.playground.hero.skills[i];
            let player = this.playground.players[0];
            let cd_end = player.skill_cds[skill.name];

            if (!cd_end || now >= cd_end) {
                $(el).find('.skill-cd-mask').css("height", "0%");
                return;
            }

            let remain = Math.max(0, cd_end - now);
            let percent = remain / (skill.cooldown * 1000);
            $(el).find('.skill-cd-mask').css("height", (percent * 100) + "%");
        });
    }
}class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app7741.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive () {
        let outer = this;

        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if (event === "message") {
                outer.receive_message(uuid, data.username, data.text);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i ++ ) {
            let player = players[i];
            if (player.uuid === uuid)
                return player;
        }

        return null;
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);

        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.blink(tx, ty);
        }
    }

    send_message(username, text) {
        let outer =this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text);
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    start() {
        let outer = this;

        $(window).resize(function () {
            outer.resize();
        });
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        if (this.game_map) this.game_map.resize();
    }

    show(mode, hero) {
    this.$playground.show();

    this.width = this.$playground.width();
    this.height = this.$playground.height();
    this.resize();

    this.scale = this.height / 1080;

    this.mode = mode;
    this.state = "waiting";

    // ⭐ 1. 先初始化数据
    this.player_count = 0;
    this.players = [];

    // ⭐ 2. 先保存 hero
    this.hero = hero;

    // ⭐ 3. 再创建地图（会立刻进入 update）
    this.game_map = new GameMap(this);

    // ⭐ 4. UI
    this.mini_map = new MiniMap(this);
    this.skill_ui = new SkillUI(this);

    this.hero_list = this.root.hero.heroes;

    // ⭐ 5. 创建玩家
    this.players.push(
        new Player(
            this,
            this.game_map.map_width / 2,
            this.game_map.map_height / 2,
            50,
            "white",
            300,
            "me",
            this.hero.name,
            this.hero.avatar,
            this.hero
        )
    );

    // ⭐ 6. AI
    for (let i = 0; i < 5; i++) {
        let hero = this.hero_list[Math.floor(Math.random() * this.hero_list.length)];

        this.players.push(
            new Player(
                this,
                Math.random() * this.game_map.map_width,
                Math.random() * this.game_map.map_height,
                50,
                "red",
                200,
                "robot",
                hero.name,
                hero.avatar,
                hero
            )
        );
    }
}

    hide() {
        this.$playground.empty();
        this.$playground.hide();
    }
}class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app7741.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app7741.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>
`);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();  // 修正方法名：getinfo -> getinfo_web
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app7741.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app7741.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app7741.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();  // 刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {  // 在远程服务器上登出
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://app7741.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register() {  // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {  // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;

        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_acapp() {
        let outer = this;

        $.ajax({
            url: "https://app7741.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {  // 修正方法名：getinfo -> getinfo_web，和目标版本保持一致
        let outer = this;

        $.ajax({
            url: "https://app7741.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}export class AcGame {
    constructor(id,AcWingOS){
       this.id=id;
       this.$ac_game = $('#' + id );
       this.AcWingOS = AcWingOS;
        
       this.settings = new Settings(this);
       this.menu = new AcGameMenu(this);
       this.hero = new AcHeroSelect(this);
       this.playground = new AcGamePlayground(this);

       this.start();
    }

    start(){

    }
}
