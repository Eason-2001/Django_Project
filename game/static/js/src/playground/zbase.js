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
}