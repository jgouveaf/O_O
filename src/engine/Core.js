/**
 * Core Engine: Manage Game Loop, State and Systems
 */
export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.lastTime = 0;
        this.entities = [];
        this.input = new InputManager();
        this.camera = new Camera(this);
        
        // Game Settings
        this.fps = 12; 
        this.renderFps = 60; 
        this.debug = false;
        this.timeScale = 1.0; // Dynamic game speed
        
        // State
        
        window.requestAnimationFrame((t) => this.loop(t));
    }

    addEntity(entity) {
        this.entities.push(entity);
        entity.game = this;
    }

    loop(timeStamp) {
        const deltaTime = (timeStamp - this.lastTime) * this.timeScale;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        window.requestAnimationFrame((t) => this.loop(t));
    }

    update(deltaTime) {
        // Always update camera for the menu pan effect
        this.camera.update(deltaTime);

        if (this.state === 'LEVEL_CLEAR' || this.state === 'INTRO') return;
        if (this.state !== 'PLAYING') return;
        
        // Check for victory
        const boss = this.entities.find(e => e.name === 'Barão Batedeira');
        if (boss && boss.hp <= 0 && this.state !== 'LEVEL_CLEAR') {
            this.victory();
        }

        if (this.timeScale < 1.0) this.timeScale += 0.005 * deltaTime;
        if (this.timeScale > 1.0) this.timeScale = 1.0;
        
        this.entities.forEach(entity => entity.update(deltaTime));
        
        // Simple Battle Collision (Beat 'em Up style)
        this.entities = this.entities.filter(e => !e.toDelete);
    }

    victory() {
        this.state = 'LEVEL_CLEAR';
        document.getElementById('iris-overlay').classList.add('active');
        document.getElementById('clear-screen').classList.remove('hide');
        this.timeScale = 0.3; // Dramatic slow mo
        this.camera.shake(500, 10);
    }

    draw() {
        this.ctx.fillStyle = '#f2e8d5'; // Aged paper color
        this.ctx.fillRect(0, 0, this.width, this.height);

        // --- BACKGROUND LAYER ---
        this.ctx.save();
        
        // Darkened Castle Silhuette
        this.ctx.fillStyle = 'rgba(51, 34, 17, 0.2)';
        this.ctx.fillRect(0, 200, this.width, 340);
        this.ctx.fillRect(100, 150, 80, 200); // Tower 1
        this.ctx.fillRect(700, 100, 100, 300); // Tower 2
        
        // SMILING MOON
        const moonX = 800;
        const moonY = 80;
        this.ctx.fillStyle = '#fefefe';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Moon Face (Expressive pie-cut eyes)
        this.ctx.fillStyle = '#000';
        // Eye 1
        this.ctx.beginPath();
        this.ctx.arc(moonX - 10, moonY - 10, 4, 0, Math.PI * 2);
        this.ctx.fill();
        // Eye 2 (Winking or pie-cut)
        this.ctx.beginPath();
        this.ctx.arc(moonX + 15, moonY - 5, 5, 0, Math.PI * 2);
        this.ctx.fill();
        // Smile
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY + 10, 20, 0.2, Math.PI - 0.2);
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.ctx.restore();
        // --- END BACKGROUND ---

        this.ctx.save();
        this.camera.apply(this.ctx);
        
        // Sorting entities by Y-axis for depth (pseudo-3D)
        this.entities.sort((a, b) => a.y - b.y);
        
        this.entities.forEach(entity => entity.draw(this.ctx));
        
        this.ctx.restore();
        
        // UI Layer
        this.entities.filter(e => e.type === 'UI').forEach(ui => ui.draw(this.ctx));
    }
}

class InputManager {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
    }
    isPressed(code) { return this.keys[code]; }
}

class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.shakeTime = 0;
        this.shakeIntensity = 0;
    }

    apply(ctx) {
        const sx = this.shakeTime > 0 ? (Math.random() - 0.5) * this.shakeIntensity : 0;
        const sy = this.shakeTime > 0 ? (Math.random() - 0.5) * this.shakeIntensity : 0;
        ctx.translate(-this.x + sx, -this.y + sy);
    }

    update(dt) {
        if (this.shakeTime > 0) this.shakeTime -= dt;
        
        if (this.game.state === 'START') {
            // Slow Panning for the Menu
            this.x += Math.sin(Date.now() * 0.0005) * 0.5;
            return;
        }

        // Follow player (simplified)
        const player = this.game.entities.find(e => e.type === 'PLAYER');
        if (player) {
            const targetX = player.x - this.game.width / 2;
            this.x += (targetX - this.x) * 0.1;
        }
    }

    shake(time, intensity) {
        this.shakeTime = time;
        this.shakeIntensity = intensity;
    }
}
