/**
 * Rubber Hose Animator: Procedural squash and stretch
 */
export class SpriteAnimator {
    constructor(owner) {
        this.owner = owner;
        this.frameTime = 0;
        this.frameSpeed = 1000 / 12; // 12 FPS animation rate
        this.currentFrame = 0;
        this.bounceTime = 0;
        this.squashFactor = 1.0;
        this.stretchFactor = 1.0;
    }

    update(dt) {
        this.frameTime += dt;
        if (this.frameTime >= this.frameSpeed) {
            this.frameTime = 0;
            this.currentFrame++;
        }

        // Procedural Idle Bounce (Rubber Hose key)
        this.bounceTime += dt;
        this.squashFactor = 1.0 + Math.sin(this.bounceTime * 0.01) * 0.05;
        this.stretchFactor = 1.0 - Math.sin(this.bounceTime * 0.01) * 0.05;
        
        // Dynamic squash on landing / jump
        if (this.owner.vy !== 0) {
            this.squashFactor = 0.85;
            this.stretchFactor = 1.25;
        }
    }

    draw(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y + height);
        ctx.scale(this.squashFactor * this.owner.facing, this.stretchFactor);
        
        // Simple shape if no sprite is loaded
        ctx.fillStyle = '#332211';
        ctx.fillRect(-width / 2, -height, width, height);
        
        // Draw Eyes (Classic Pac-man style)
        ctx.fillStyle = '#fefefe';
        ctx.beginPath();
        ctx.arc(-5, -height+15, 6, 0, Math.PI*2);
        ctx.arc(5, -height+15, 6, 0, Math.PI*2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -height+15, 2, 0, Math.PI*2);
        ctx.arc(5, -height+15, 2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }
}
