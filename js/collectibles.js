// Collectible types
const COLLECTIBLES = {
    SUBWAY_TOKEN: 'subway_token',
    METS_HAT: 'mets_hat',
    BASEBALL_BAT: 'baseball_bat'
};

// Active collectibles in the game
let collectibles = [];

// Collectible class
class Collectible {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.collected = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
    }
    
    update() {
        // Animate collectibles
        this.animationFrame += this.animationSpeed;
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        // Floating animation
        const floatY = this.y + Math.sin(this.animationFrame) * 3;
        
        switch(this.type) {
            case COLLECTIBLES.SUBWAY_TOKEN:
                this.drawSubwayToken(ctx, this.x, floatY);
                break;
            case COLLECTIBLES.METS_HAT:
                this.drawMetsHat(ctx, this.x, floatY);
                break;
            case COLLECTIBLES.BASEBALL_BAT:
                this.drawBaseballBat(ctx, this.x, floatY);
                break;
        }
    }
    
    drawSubwayToken(ctx, x, y) {
        // Draw a NYC subway token (yellow circle with hole)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle (hole)
        ctx.fillStyle = '#5C94FC'; // Sky color to make it look like a hole
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add "NYC" text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NYC', x + 12, y + 12);
    }
    
    drawMetsHat(ctx, x, y) {
        // Draw a Mets baseball cap (blue with orange)
        // Cap crown (rounded top)
        ctx.fillStyle = '#002D72'; // Mets blue
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 10, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();
        
        // Cap base
        ctx.fillRect(x + 2, y + 12, 20, 6);
        
        // Hat brim (curved)
        ctx.fillStyle = '#002D72';
        ctx.beginPath();
        ctx.ellipse(x + 12, y + 18, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Orange button on top
        ctx.fillStyle = '#FF5910'; // Mets orange
        ctx.beginPath();
        ctx.arc(x + 12, y + 4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mets logo (stylized NY)
        ctx.strokeStyle = '#FF5910';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        // Draw stylized N
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 16);
        ctx.lineTo(x + 6, y + 8);
        ctx.lineTo(x + 10, y + 16);
        ctx.lineTo(x + 10, y + 8);
        ctx.stroke();
        
        // Draw stylized Y
        ctx.beginPath();
        ctx.moveTo(x + 14, y + 8);
        ctx.lineTo(x + 16, y + 12);
        ctx.lineTo(x + 18, y + 8);
        ctx.moveTo(x + 16, y + 12);
        ctx.lineTo(x + 16, y + 16);
        ctx.stroke();
    }
    
    drawBaseballBat(ctx, x, y) {
        // Draw a realistic baseball bat
        
        // Bat barrel (thick end)
        ctx.fillStyle = '#D2691E'; // Light wood color
        ctx.beginPath();
        ctx.ellipse(x + 12, y + 4, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bat body (tapered)
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 4);
        ctx.lineTo(x + 18, y + 4);
        ctx.lineTo(x + 14, y + 18);
        ctx.lineTo(x + 10, y + 18);
        ctx.closePath();
        ctx.fill();
        
        // Handle
        ctx.fillStyle = '#8B4513'; // Darker wood
        ctx.fillRect(x + 11, y + 18, 2, 4);
        
        // Grip tape
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 19);
        ctx.lineTo(x + 14, y + 19);
        ctx.moveTo(x + 10, y + 21);
        ctx.lineTo(x + 14, y + 21);
        ctx.stroke();
        
        // Wood grain lines
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 6);
        ctx.lineTo(x + 12, y + 16);
        ctx.moveTo(x + 16, y + 6);
        ctx.lineTo(x + 12, y + 16);
        ctx.stroke();
    }
    
    checkCollision(playerX, playerY, playerWidth, playerHeight) {
        if (this.collected) return false;
        
        return playerX < this.x + this.width &&
               playerX + playerWidth > this.x &&
               playerY < this.y + this.height &&
               playerY + playerHeight > this.y;
    }
    
    collect() {
        this.collected = true;
        
        switch(this.type) {
            case COLLECTIBLES.SUBWAY_TOKEN:
                game.score += 100;
                document.getElementById('score').textContent = game.score;
                soundManager.play('coin');
                createParticles(this.x + 12, this.y + 12, 'token', 8);
                break;
            case COLLECTIBLES.METS_HAT:
                // Transform Mary to big size
                if (!mary.isBig) {
                    mary.isBig = true;
                    mary.height = 32 * SCALE;  // Double height
                    mary.y -= 16 * SCALE;      // Adjust position so she doesn't fall through floor
                }
                soundManager.play('powerup');
                createParticles(this.x + 12, this.y + 12, 'powerup', 10);
                break;
            case COLLECTIBLES.BASEBALL_BAT:
                // Give Mary baseball bat power
                mary.hasBat = true;
                // Also make her big if she isn't already
                if (!mary.isBig) {
                    mary.isBig = true;
                    mary.height = 32 * SCALE;
                    mary.y -= 16 * SCALE;
                }
                soundManager.play('powerup');
                createParticles(this.x + 12, this.y + 12, 'powerup', 10);
                break;
        }
    }
}

// Initialize collectibles for the level
function initializeCollectibles() {
    collectibles = [];
    // All collectibles now come from question blocks only
}

// Update all collectibles
function updateCollectibles() {
    collectibles.forEach(collectible => {
        collectible.update();
        
        // Check collision with Mary
        if (collectible.checkCollision(mary.x, mary.y, mary.width, mary.height)) {
            collectible.collect();
        }
    });
}

// Draw all collectibles
function drawCollectibles(ctx) {
    collectibles.forEach(collectible => {
        collectible.draw(ctx);
    });
}

// Get remaining collectibles count
function getRemainingTokens() {
    return collectibles.filter(c => 
        c.type === COLLECTIBLES.SUBWAY_TOKEN && !c.collected
    ).length;
}