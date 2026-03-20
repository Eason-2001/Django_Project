class AcHeroSelect {
    constructor(root) {
        this.root = root;
        this.$hero_select = $(`
            <div class="ac-game-hero-select">
                <div class="ac-game-hero-select-title">选择你的英雄</div>
                <div class="ac-game-hero-select-container">
                    <div class="ac-game-hero-select-arrow-left"><</div>
                    <div class="ac-game-hero-select-image"></div>
                    <div class="ac-game-hero-select-arrow-right">></div>
                </div>
                <button class="ac-game-hero-select-btn">确定</button>
            </div>
        `);
        this.$hero_select.hide();
        this.root.$ac_game.append(this.$hero_select);

        this.$confirm_btn = this.$hero_select.find('.ac-hero-select-btn');
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$confirm_btn.click(function() {
            outer.hide(); // 动作 1：隐藏自己
            outer.root.playground.show(); // 动作 2：展示游戏舞台
        });
    }

    show() { this.$hero_select.show(); }
    hide() { this.$hero_select.hide(); }
}