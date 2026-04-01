/**
 * Visual Onomatopoeias (POW!, ZAP!, CRASH!)
 */
export class VisualSFX {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.type = 'UI';
        this.lifetime = 1000; // ms
        this.vy = -1;
        this.opacity = 1.0;
        this.size = 20 + Math.random() * 20;
        this.rotation = (Math.random() - 0.5) * 0.5;
    }

    update(dt) {
        this.lifetime -= dt;
        this.y += this.vy;
        this.opacity = this.lifetime / 1000;
        if (this.lifetime <= 0) this.toDelete = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Vintage Comic Style
        ctx.font = `bold ${this.size}px "Courier New"`;
        ctx.fillStyle = '#000';
        ctx.fillText(this.text, 2, 2); // Shadow
        ctx.fillStyle = '#f00'; // Impact Red
        if (this.text === 'PARRY!') ctx.fillStyle = '#0ff';
        ctx.fillText(this.text, 0, 0);
        
        ctx.restore();
    }
}
