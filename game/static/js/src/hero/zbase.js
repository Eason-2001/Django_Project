class AcHeroSelect {
    constructor(root) {
        this.root = root;
        this.heroes = [
            {
                id: 1,
                name: "武僧马嘉祺",
                avatar: "/static/image/menu/majiaqi.jpg",
                skills: [
                    { name: "冲锋", desc: "快速冲向敌人并造成眩晕" },
                    { name: "旋风斩", desc: "旋转攻击周围所有敌人" },
                    { name: "斩杀", desc: "对低血量敌人造成真实伤害" }
                ]
            },
            {
                id: 2,
                name: "邪恶小明睿",
                avatar: "/static/image/menu/mingrui.jpg",
                skills: [
                    { name: "火球术", desc: "发射火球造成范围伤害" },
                    { name: "冰霜新星", desc: "冻结周围敌人并减速" },
                    { name: "闪现", desc: "瞬间位移到指定位置" }
                ]
            },
            {
                id: 3,
                name: "老炮手佳批",
                avatar: "/static/image/menu/chengjia.jpg",
                skills: [
                    { name: "精准射击", desc: "对单个目标造成高额伤害" },
                    { name: "箭雨", desc: "向空中射出大量箭矢造成范围伤害" },
                    { name: "闪避", desc: "短暂免疫伤害并向后位移" }
                ]
            }
        ];
        this.current_idx = 0;
        this.$hero_select = $(`
            <div class="ac-game-hero-total">
                <div class="ac-game-hero-select">
                    <div class="ac-game-hero-select-title">选择你的英雄</div>
                    
                    <!-- 英雄名字 动态显示 -->
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
        this.$hero_name = this.$hero_select.find('.ac-game-hero-name'); // 英雄名字
        this.$skills_container = this.$hero_select.find('.ac-game-hero-select-skills');

        this.start();
        this.render();
    }

    start() {
        this.add_listening_events();
    }

    // 渲染：头像 + 名字 + 技能
    render() {
        const hero = this.heroes[this.current_idx];

        // 1. 更新头像
        this.$hero_image.css({
            "background-image": `url(${hero.avatar})`,
            "background-size": "cover",
            "background-position": "center"
        });

        // 2. ✅ 更新英雄名字
        this.$hero_name.text(hero.name);

        // 3. 更新技能
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

        // 确定
        this.$confirm_btn.click(function() {
            outer.hide();
            outer.root.playground.show("single mode", outer.heroes[outer.current_idx]);
        });

        // 左箭头
        this.$arrow_left.click(function() {
            outer.current_idx = (outer.current_idx - 1 + outer.heroes.length) % outer.heroes.length;
            outer.render();
        });

        // 右箭头
        this.$arrow_right.click(function() {
            outer.current_idx = (outer.current_idx + 1) % outer.heroes.length;
            outer.render();
        });
    }

    show() { this.$hero_select.show(); }
    hide() { this.$hero_select.hide(); }
}