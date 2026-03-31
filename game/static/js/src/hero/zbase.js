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
}