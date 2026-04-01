import { Enemy } from './Enemy.js';

export class WhiskingWarlord extends Enemy {
    constructor(x, y) {
        super(x, y, 'Barão Batedeira');
        this.maxHP = 1000;
        this.hp = 1000;
        this.w = 120;
        this.h = 160;
        this.phase = 1;
        this.animator.setSprite('boss1.png'); // Root
    }

    update(dt) {
        super.update(dt);
        
        // BOSS LOGIC
        if (this.phase === 3) {
            // "Frame Skipping" effect for high-speed tornado
            this.game.renderFps = Math.random() > 0.5 ? 60 : 5;
            this.vx = Math.sin(Date.now() * 0.01) * 10;
        }
    }

    takeDamage(amount) {
        super.takeDamage(amount);
        
        // Visual cue on Phase Change
        if (this.phase === 2) {
            document.querySelector('.grain').style.opacity = '0.7'; // Flour dust
        } else if (this.phase === 3) {
            document.getElementById('game-container').classList.add('jitter');
        }
    }
    
    attack() {
        super.attack('heavy');
        this.game.camera.shake(300, 20); // Massive impact
    }
}
