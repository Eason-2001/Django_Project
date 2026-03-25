export class AcGame {
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
