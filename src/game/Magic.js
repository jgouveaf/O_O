import { Entity } from './Entity.js';

export class InkBlackHole extends Entity {
    constructor(x, y, type = 'Coffee/Fire') {
        super(x, y, 100, 100, 'MAGIC');
        this.type = type;
        this.lifetime = 4000; // ms
        this.radius = 10;
        this.maxRadius = 120;
        this.rotation = 0;
        this.pulsation = 0;
    }

    update(dt) {
        this.lifetime -= dt;
        if (this.lifetime <= 0) this.toDelete = true;
        
        // Growth and Pulsation linked to Jazz "Groove"
        if (this.radius < this.maxRadius) this.radius += 0.2 * dt;
        this.rotation += 0.01 * dt;
        this.pulsation = Math.sin(Date.now() * 0.005) * 10;
        
        // SUCTION LOGIC (Beat 'em Up style)
        this.game.entities.forEach(e => {
            if (e.type === 'ENEMY') {
                const dx = this.x - e.x;
                const dy = this.y - e.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < this.radius * 2) {
                    // Pull intensity increases as they get closer
                    const pull = (this.radius * 2 - dist) / 100;
                    e.x += dx * pull * 0.1;
                    e.y += dy * pull * 0.1;
                    
                    // Damage over time
                    if (Math.random() > 0.95) e.takeDamage(1);
                    
                    // Visual distortion (Squash enemy towards hole)
                    e.animator.squashFactor = 0.5 + (dist/200);
                }
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // THE VORTEX: Multi-layered ink swirls
        const currentR = this.radius + this.pulsation;
        
        // --- FILM TEARING EFFECT ---
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(0, 0, currentR * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        // --- END TEAR ---

        // Outer glow (Film Burn)
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#000';
        
        ctx.beginPath();
        ctx.arc(0, 0, currentR, 0, Math.PI * 2);
        ctx.fillStyle = '#000'; // Pure Ink
        ctx.fill();
        
        // Swirls
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 10]);
        for(let i=0; i<3; i++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.arc(0, 0, currentR * 0.8, 0, Math.PI * 1.5);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}
