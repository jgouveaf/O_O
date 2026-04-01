import { Entity } from './Entity.js';

export class Enemy extends Entity {
    constructor(x, y, name = 'Forker') {
        super(x, y, 50, 70, 'ENEMY');
        this.name = name;
        this.phase = 1;
        this.maxHP = 100;
        this.hp = 100;
        this.attackCooldown = 0;
    }

    update(dt) {
        super.update(dt);
        
        // Follow player (AI)
        const player = this.game.entities.find(e => e.type === 'PLAYER');
        if (player) {
            const dx = player.x - this.x;
            this.vx = Math.sign(dx) * 0.1 * dt;
            this.facing = Math.sign(dx);
            
            // JAZZ SYNC: Attack only near the beat
            if (this.game.music.isOnBeat(50) && this.attackCooldown <= 0) {
                this.attack();
            }
        }
        
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
    }

    attack() {
        this.attackCooldown = 2000; // General cooldown
        // Visual cue: Squash and flash
        this.animator.squashFactor = 1.4;
        this.animator.stretchFactor = 0.6;
        
        // Check for damage to player
        const player = this.game.entities.find(e => e.type === 'PLAYER');
        if (player && Math.abs(player.x - this.x) < 50) {
            if (!player.isParrying) {
                player.hp -= 10;
                this.game.camera.shake(100, 10);
            } else {
                // PARRY SUCCESS! (Tinta generated in player class)
                this.vx = -this.facing * 5 * 10; // Knockback
            }
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        
        // Phase-based background change (33%)
        const hpPercent = this.hp / this.maxHP;
        if (hpPercent < 0.66 && this.phase === 1) {
            this.phase = 2;
            this.game.onPhaseChange(2);
        } else if (hpPercent < 0.33 && this.phase === 2) {
            this.phase = 3;
            this.game.onPhaseChange(3);
        }
        
        if (this.hp <= 0) this.toDelete = true;
    }
}
