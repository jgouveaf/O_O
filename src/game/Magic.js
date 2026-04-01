import { Entity } from './Entity.js';

export class MagicProjection extends Entity {
    constructor(x, y, type = 'Coffee/Fire') {
        super(x, y, 100, 100, 'MAGIC');
        this.type = type;
        this.lifetime = 2000; // ms
        this.radius = 50;
        this.vx = 0;
        this.vy = 0;
    }

    update(dt) {
        this.lifetime -= dt;
        if (this.lifetime <= 0) this.toDelete = true;
        
        // Scene Effects implementation: Creating black holes or burning film
        this.radius += 0.1 * dt;
        
        // Attack logic
        this.game.entities.forEach(e => {
            if (e.type === 'ENEMY') {
                const dist = Math.sqrt((e.x - this.x) ** 2 + (e.y - this.y) ** 2);
                if (dist < this.radius) {
                    e.takeDamage(10);
                    // Suction effect (Black hole)
                    e.x += (this.x - e.x) * 0.05;
                    e.y += (this.y - e.y) * 0.05;
                }
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out'; // This "burns" the scene (film effect)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
        ctx.restore();
        
        // Colored ink effect
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.restore();
    }

    getColor() {
        switch(this.type) {
            case 'Coffee/Fire': return '#4e2a00';
            case 'Tea/Ice': return '#00ffff';
            case 'Poison/Acid': return '#66ff00';
            case 'Mercury/Electricity': return '#c0c0c0';
            default: return '#000';
        }
    }
}
