export class Blink extends AcGameObject {
    constructor(playground, player, tx, ty, stun = false, invincible = false) {
        super();
        this.playground = playground;
        this.player = player;

        this.tx = tx;
        this.ty = ty;

        this.max_dist = 400; // 最大闪现距离（像素）
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

        // 瞬间改变坐标
        p.x += Math.cos(angle) * dist;
        p.y += Math.sin(angle) * dist;

        // ⭐ 关键：不要设置 p.move_length = 0!
        // 这样闪现完后，如果之前有移动目标，玩家会继续向原目标丝滑滑行。

        // 如果你希望闪现完依然有惯性，可以保留当前的 vx, vy

        this.destroy();
    }
}