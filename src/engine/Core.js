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
        this.fps = 12; // Vintage 12fps animation rate
        this.renderFps = 60; // 60fps physics/render
        this.debug = false;
        
        // State
        this.state = 'START'; // START, PLAYING, PHASE_TRANSITION, GAME_OVER
        
        window.requestAnimationFrame((t) => this.loop(t));
    }

    addEntity(entity) {
        this.entities.push(entity);
        entity.game = this;
    }

    loop(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        window.requestAnimationFrame((t) => this.loop(t));
    }

    update(deltaTime) {
        if (this.state !== 'PLAYING') return;
        
        this.camera.update(deltaTime);
        this.entities.forEach(entity => entity.update(deltaTime));
        
        // Simple Battle Collision (Beat 'em Up style)
        this.entities = this.entities.filter(e => !e.toDelete);
    }

    draw() {
        this.ctx.fillStyle = '#f2e8d5'; // Aged paper color
        this.ctx.fillRect(0, 0, this.width, this.height);

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
