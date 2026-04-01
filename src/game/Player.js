import { Entity } from './Entity.js';
import { InkBlackHole } from './Magic.js';
import { VisualSFX } from '../graphics/Effects.js';

export class Player extends Entity {
    constructor(x, y, charType = 'KETTLETON') {
        super(x, y, 40, 60, 'PLAYER');
        this.charType = charType;
        this.applyStats();
        
        // General Combat
        this.ink = 0;
        this.maxInk = 100;
        this.comboCounter = 0;
        this.lastAttackTime = 0;
        this.isAttacking = false;
        this.isParrying = false;
        this.parryWindow = 200; // ms
    }

    applyStats() {
        if (this.charType === 'KETTLETON') {
            this.moveSpeed = 0.25;
            this.jumpForce = -0.5;
            this.hp = 100;
            this.maxHp = 100;
            this.attackDamage = 10;
        } else if (this.charType === 'CAL') {
            this.moveSpeed = 0.15;
            this.jumpForce = -0.4;
            this.hp = 200;
            this.maxHp = 200;
            this.attackDamage = 25;
            this.w = 60;
            this.h = 80;
        } else if (this.charType === 'TILLY') {
            this.moveSpeed = 0.2;
            this.jumpForce = -0.6; // High jump
            this.hp = 75;
            this.maxHp = 75;
            this.attackDamage = 15;
            this.w = 30; // Small
            this.h = 70;
        } else if (this.charType === 'CHRONO') {
            this.moveSpeed = 0.45; // Super fast
            this.jumpForce = -0.4;
            this.hp = 100;
            this.maxHp = 100;
            this.attackDamage = 8; // Multi-hit focus
            this.w = 35;
            this.h = 60;
        }
    }

    update(dt) {
        super.update(dt);
        
        // Input Handling
        if (this.game.input.isPressed('KeyA')) {
            this.vx = -this.moveSpeed * dt;
            this.facing = -1;
        } else if (this.game.input.isPressed('KeyD')) {
            this.vx = this.moveSpeed * dt;
            this.facing = 1;
        } else {
            this.vx *= 0.8;
        }

        // Jump
        if (this.game.input.isPressed('Space') && this.isGrounded) {
            this.vy = this.jumpForce * dt * 0.5;
            this.isGrounded = false;
        }

        // Combat Controls
        if (this.game.input.isPressed('KeyJ')) this.attack('light');
        if (this.game.input.isPressed('KeyK')) this.attack('heavy');
        if (this.game.input.isPressed('KeyL')) this.parry();
        if (this.game.input.isPressed('KeyU')) this.castSpell();
    }

    attack(type) {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        
        // Hitbox detection
        const hitbox = {
            x: this.x + (this.facing === 1 ? 20 : -60),
            y: this.y - 40,
            w: 40,
            h: 40
        };

        // Screen Shake on impact
        this.game.camera.shake(100, 5);

        // Reset attack after animation time
        setTimeout(() => this.isAttacking = false, 300);
        
        // Combo increment
        const now = Date.now();
        if (now - this.lastAttackTime < 800) {
            this.comboCounter++;
        } else {
            this.comboCounter = 1;
        }
        this.lastAttackTime = now;
        
        this.checkCollision(hitbox, type);
    }

    parry() {
        if (this.isParrying) return;
        this.isParrying = true;
        this.ink += 5; // Success on rhythm generates ink
        if (this.ink > this.maxInk) this.ink = this.maxInk;
        
        setTimeout(() => this.isParrying = false, this.parryWindow);
    }

    castSpell() {
        if (this.ink >= 50) {
            this.ink -= 50;
            const hole = new InkBlackHole(this.x + this.facing * 100, this.y - 50);
            this.game.addEntity(hole);
            this.game.camera.shake(500, 15);
        }
    }

    checkCollision(hitbox, type) {
        this.game.entities.forEach(e => {
            if (e.type === 'ENEMY') {
                if (hitbox.x < e.x + e.w && hitbox.x + hitbox.w > e.x &&
                    hitbox.y < e.y + e.h && hitbox.y + hitbox.h > e.y) {
                    e.takeDamage(type === 'heavy' ? 20 : 10);
                }
            }
        });
    }
}
