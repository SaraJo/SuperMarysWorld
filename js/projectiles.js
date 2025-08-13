// Projectile class for baseballs
class Baseball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.velocityX = direction * 8; // Speed of baseball
        this.velocityY = -2; // Slight upward arc
        this.gravity = 0.3;
        this.rotation = 0;
        this.active = true;
    }
    
    update() {
        if (!this.active) return;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        
        // Rotate the baseball
        this.rotation += 0.3;
        
        // Check collision with level
        const collision = checkLevelCollision(level1_1, this.x, this.y, this.width, this.height);
        if (collision.collided) {
            this.active = false;
            
            // Break bricks if hit
            if (collision.tileType === TILES.BRICK) {
                const tileCol = Math.floor((collision.tileX + TILE_SIZE/2) / TILE_SIZE);
                const tileRow = Math.floor((collision.tileY + TILE_SIZE/2) / TILE_SIZE);
                level1_1[tileRow][tileCol] = TILES.EMPTY;
                
                // Add score for breaking brick
                game.score += 50;
                document.getElementById('score').textContent = game.score;
                
                // Brick breaking effects
                soundManager.play('break');
                createParticles(collision.tileX + TILE_SIZE/2, collision.tileY + TILE_SIZE/2, 'brick', 8);
            }
        }
        
        // Remove if off screen
        if (this.x < -50 || this.x > GAME_WIDTH + 50 || this.y > GAME_HEIGHT) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        // Draw baseball
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw stitches
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 6, Math.PI, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Active projectiles array
let projectiles = [];

// Fire a baseball
function fireBaseball() {
    if (!mary.hasBat) return;
    
    // Determine direction (1 for right, -1 for left)
    const direction = mary.lastDirection || 1;
    
    // Start position slightly in front of Mary
    const startX = mary.x + (direction > 0 ? mary.width : -12);
    const startY = mary.y + mary.height / 2;
    
    projectiles.push(new Baseball(startX, startY, direction));
    soundManager.play('shoot');
}

// Update all projectiles
function updateProjectiles() {
    // Update each projectile
    projectiles.forEach(projectile => projectile.update());
    
    // Remove inactive projectiles
    projectiles = projectiles.filter(projectile => projectile.active);
}

// Draw all projectiles
function drawProjectiles(ctx) {
    projectiles.forEach(projectile => projectile.draw(ctx));
}