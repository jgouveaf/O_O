/**
 * Entity Base Class for Physics and Interaction
 */
import { SpriteAnimator } from '../graphics/Animator.js';

export class Entity {
    constructor(x, y, w, h, type = 'ENTITY') {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.facing = 1;
        this.isGrounded = false;
        this.animator = new SpriteAnimator(this);
        this.game = null;
        this.toDelete = false;
        this.hp = 100;
        this.maxHp = 100;
    }

    update(dt) {
        // Physics Gravity
        this.vy += 0.05 * dt;
        this.y += this.vy;
        this.x += this.vx;

        // Ground check
        if (this.y > 400) {
            this.y = 400;
            this.vy = 0;
            this.isGrounded = true;
        }

        this.animator.update(dt);
    }

    draw(ctx) {
        this.animator.draw(ctx, this.x, this.y, this.w, this.h);
    }
}
