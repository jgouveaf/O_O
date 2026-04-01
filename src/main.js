import { Game } from './engine/Core.js';
import { Player } from './game/Player.js';
import { Enemy } from './game/Enemy.js';
import { MusicManager } from './engine/MusicManager.js';

// Initialize Game
const game = new Game('gameCanvas');

// Add Music Manager (Jazz Sync at 120 BPM)
game.music = new MusicManager(120);

// Initialize Protagonist (Pothead / cabeza de bule)
const pothead = new Player(100, 300);
game.addEntity(pothead);

// Initial Wave of Enemies (Corrupted Utensils)
game.addEntity(new Enemy(600, 300, 'Garfo Corrompido'));
game.addEntity(new Enemy(800, 300, 'Faca Amolada'));

// Phase Transition Visuals
game.onPhaseChange = (phase) => {
    const filters = document.querySelector('.film-overlay');
    const grain = document.querySelector('.grain');
    const container = document.getElementById('game-container');
    
    if (phase === 2) {
        grain.style.opacity = '0.4'; // Increase grit
        container.style.filter = 'sepia(0.5) contrast(1.2)';
        game.camera.shake(500, 15);
    } else if (phase === 3) {
        // Film burning effect (Visual breakdown)
        container.classList.add('jitter'); 
        container.style.filter = 'sepia(0.8) contrast(1.5) hue-rotate(-20deg)';
        game.camera.shake(1000, 30);
    }
};

// HUD and Interface
class HUD {
    constructor() {
        this.type = 'UI';
        this.x = 0; this.y = 0; this.w = 0; this.h = 0;
    }
    update(dt) {}
    draw(ctx) {
        // Vintage Lifebar (Ink bottle style)
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px "Courier New"';
        ctx.fillText('HP: ' + pothead.hp, 20, 40);
        
        ctx.fillStyle = '#4e2a00'; // Dark Coffee Ink
        ctx.fillRect(20, 50, pothead.ink * 2, 20);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 50, 200, 20);
        ctx.fillText('INK (Magia): ' + Math.floor(pothead.ink), 20, 90);
        
        // Combo Count (Rubber hose style bouncy text)
        if (pothead.comboCounter > 1) {
            ctx.fillStyle = '#f00';
            ctx.font = (30 + Math.sin(Date.now()*0.01)*10) + 'px "Courier New"';
            ctx.fillText(pothead.comboCounter + ' COMBO!', 400, 100);
        }
    }
}

game.addEntity(new HUD());

// Start the game loop
game.state = 'PLAYING';

console.log("CHÁ DE PANCADA INITIALIZED: 1930s Beat 'em Up");
