class AcGameMenu{
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
