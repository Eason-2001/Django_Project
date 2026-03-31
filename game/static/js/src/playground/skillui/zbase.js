// 继承 AcGameObject，加入游戏主循环，每帧自动更新！
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
}