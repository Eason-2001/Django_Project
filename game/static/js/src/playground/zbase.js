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
        this.hero = hero;
        this.scale = this.height / 1080;
        this.$playground.show();


        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.game_map = new GameMap(this);

        this.mode = mode;
        this.state = "waiting";
        this.player_count = 0;

        this.resize();

        this.players = [];

        // 主角（世界中心）
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
                this.hero.avatar,   // ⭐用英雄头像
                this.hero           // ⭐把整个英雄传进去
            )
        );

        // 机器人
        for (let i = 0; i < 5; i++) {
            this.players.push(
                new Player(
                    this,
                    Math.random() * this.game_map.map_width,
                    Math.random() * this.game_map.map_height,
                    50,
                    "red",
                    200,
                    "robot",
                    "robot",
                    ""
                )
            );
        }
    }

    hide() {
        this.$playground.empty();
        this.$playground.hide();
    }
}