import { Entity } from './Entity.js';
import { VisualSFX } from '../graphics/Effects.js';

export class Enemy extends Entity {
    constructor(x, y, name = 'Forker') {
        super(x, y, 50, 70, 'ENEMY');
        this.name = name;
        this.behavior = this.getBehavior(name);
        this.phase = 1;
        this.maxHP = 100;
        this.hp = 100;
        this.attackCooldown = 0;
        this.state = 'WANDER'; // WANDER, CHARGE, ATTACK, RETREAT
    }

    getBehavior(name) {
        if (name.includes('Garfo')) return 'LANCER';
        if (name.includes('Prato')) return 'SHIELD';
        if (name.includes('Ervilha')) return 'ARCHER';
        return 'GRUNT';
    }

    update(dt) {
        super.update(dt);
        
        const player = this.game.entities.find(e => e.type === 'PLAYER');
        if (!player) return;

        const dx = player.x - this.x;
        const dist = Math.abs(dx);

        // AI DECISION TREE
        switch(this.behavior) {
            case 'LANCER': this.updateLancer(dt, dx, dist); break;
            case 'SHIELD': this.updateShield(dt, dx, dist); break;
            case 'ARCHER': this.updateArcher(dt, dx, dist); break;
            default: this.updateGrunt(dt, dx, dist); break;
        }

        if (this.attackCooldown > 0) this.attackCooldown -= dt;
    }

    updateLancer(dt, dx, dist) {
        this.facing = Math.sign(dx);
        if (dist > 60) {
            this.vx = this.facing * 0.12 * dt;
        } else if (this.attackCooldown <= 0) {
            this.attack();
        } else {
            this.vx = 0;
        }
    }

    updateShield(dt, dx, dist) {
        this.facing = Math.sign(dx);
        this.vx = this.facing * 0.05 * dt; // Slow march
        if (dist < 40 && this.attackCooldown <= 0) {
            this.attack('push');
        }
    }

    updateArcher(dt, dx, dist) {
        this.facing = Math.sign(dx);
        if (dist < 300) {
            this.vx = -this.facing * 0.1 * dt; // Keep distance
        } else {
            this.vx = 0;
        }

        if (this.game.music.isOnBeat(50) && this.attackCooldown <= 0) {
            this.shoot();
        }
    }

    updateGrunt(dt, dx, dist) {
        this.vx = Math.sign(dx) * 0.1 * dt;
        this.facing = Math.sign(dx);
        if (this.game.music.isOnBeat(50) && this.attackCooldown <= 0) this.attack();
    }

    attack(type = 'normal') {
        this.attackCooldown = 2000;
        this.animator.squashFactor = type === 'push' ? 1.6 : 1.4;
        this.animator.stretchFactor = type === 'push' ? 0.4 : 0.6;
        
        const player = this.game.entities.find(e => e.type === 'PLAYER');
        if (player && Math.abs(player.x - this.x) < 60) {
            if (!player.isParrying) {
                player.hp -= type === 'push' ? 5 : 10;
                if (type === 'push') player.vx = this.facing * 50; 
                this.game.camera.shake(100, 10);
            } else {
                // PARRY SUCCESS!
                this.game.timeScale = 0.1; 
                this.vx = -this.facing * 50;
                this.game.camera.shake(300, 5);
                
                // --- NEW VISUAL SFX ---
                const sfx = new VisualSFX(this.x, this.y - 50, 'PARRY!');
                this.game.addEntity(sfx);
            }
        }
    }

    shoot() {
        this.attackCooldown = 1500;
        // Visual feedback for shooting
        this.animator.squashFactor = 1.8;
        // In a full game, we would spawn a Projectile entity here
        console.log(this.name + " disparou uma ervilha!");
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
