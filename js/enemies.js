// Enemy types
const ENEMY_TYPES = {
    PIGEON: 'pigeon',
    TAXI: 'taxi',
    HOT_DOG_VENDOR: 'hot_dog_vendor'
};

// Enemy class
class Enemy {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.velocityX = -1; // Move left by default
        this.velocityY = 0;
        this.active = true;
        this.animationFrame = 0;
        this.squashed = false;
        this.squashTimer = 0;
    }
    
    update() {
        if (!this.active) return;
        
        if (this.squashed) {
            this.squashTimer--;
            if (this.squashTimer <= 0) {
                this.active = false;
            }
            return;
        }
        
        // Update animation
        this.animationFrame += 0.1;
        
        // Move horizontally
        this.x += this.velocityX;
        
        // Apply gravity
        this.velocityY += 0.5;
        this.y += this.velocityY;
        
        // Check collision with level
        const collision = checkLevelCollision(level1_1, this.x, this.y, this.width, this.height);
        if (collision.collided) {
            if (this.velocityY > 0) {
                // Landing on ground
                this.y = collision.tileY - this.height;
                this.velocityY = 0;
            } else if (this.velocityY < 0) {
                // Hit ceiling
                this.y = collision.tileY + TILE_SIZE;
                this.velocityY = 0;
            } else {
                // Hit wall - reverse direction
                this.velocityX *= -1;
                this.x += this.velocityX * 2; // Move away from wall
            }
        }
        
        // Remove if fallen off screen
        if (this.y > GAME_HEIGHT + 100) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        switch(this.type) {
            case ENEMY_TYPES.PIGEON:
                this.drawPigeon(ctx);
                break;
            case ENEMY_TYPES.TAXI:
                this.drawTaxi(ctx);
                break;
            case ENEMY_TYPES.HOT_DOG_VENDOR:
                this.drawHotDogVendor(ctx);
                break;
        }
    }
    
    drawPigeon(ctx) {
        if (this.squashed) {
            // Draw squashed pigeon
            ctx.fillStyle = '#808080';
            ctx.fillRect(this.x, this.y + this.height - 8, this.width, 8);
            return;
        }
        
        // Body
        ctx.fillStyle = '#808080'; // Gray
        ctx.beginPath();
        ctx.ellipse(this.x + 12, this.y + 12, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y + 8, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FFA500'; // Orange
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + 8);
        ctx.lineTo(this.x + 0, this.y + 9);
        ctx.lineTo(this.x + 2, this.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 4, this.y + 7, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 12, 6, -Math.PI/4, Math.PI/4);
        ctx.stroke();
        
        // Feet (animated walking)
        const footOffset = Math.sin(this.animationFrame * 4) * 2;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 20);
        ctx.lineTo(this.x + 8 + footOffset, this.y + 24);
        ctx.moveTo(this.x + 16, this.y + 20);
        ctx.lineTo(this.x + 16 - footOffset, this.y + 24);
        ctx.stroke();
    }
    
    drawTaxi(ctx) {
        // Will be implemented later
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    drawHotDogVendor(ctx) {
        // Will be implemented later
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    checkCollisionWithPlayer() {
        if (!this.active || this.squashed) return false;
        
        return mary.x < this.x + this.width &&
               mary.x + mary.width > this.x &&
               mary.y < this.y + this.height &&
               mary.y + mary.height > this.y;
    }
    
    checkStompedOn() {
        if (!this.active || this.squashed) return false;
        
        // Check if Mary is falling and lands on top of enemy
        if (mary.velocityY > 0 && 
            mary.y + mary.height > this.y &&
            mary.y + mary.height < this.y + this.height/2 &&
            mary.x + mary.width > this.x &&
            mary.x < this.x + this.width) {
            
            this.squashed = true;
            this.squashTimer = 30;
            this.velocityX = 0;
            
            // Bounce Mary up
            mary.velocityY = -10;
            
            // Add score
            game.score += 100;
            document.getElementById('score').textContent = game.score;
            
            // Stomp effects
            soundManager.play('stomp');
            createParticles(this.x + this.width/2, this.y + this.height/2, 'stomp', 5);
            
            return true;
        }
        return false;
    }
    
    checkHitByProjectile() {
        if (!this.active || this.squashed) return false;
        
        for (let projectile of projectiles) {
            if (projectile.active &&
                projectile.x < this.x + this.width &&
                projectile.x + projectile.width > this.x &&
                projectile.y < this.y + this.height &&
                projectile.y + projectile.height > this.y) {
                
                // Enemy defeated
                this.active = false;
                projectile.active = false;
                
                // Add score
                game.score += 200;
                document.getElementById('score').textContent = game.score;
                
                // Hit effects
                soundManager.play('stomp');
                createParticles(this.x + this.width/2, this.y + this.height/2, 'stomp', 6);
                
                return true;
            }
        }
        return false;
    }
}

// Active enemies
let enemies = [];

// Initialize enemies for the level
function initializeEnemies() {
    enemies = [];
    
    // Add pigeons at various locations
    enemies.push(new Enemy(ENEMY_TYPES.PIGEON, 400, 400));
    enemies.push(new Enemy(ENEMY_TYPES.PIGEON, 600, 400));
    enemies.push(new Enemy(ENEMY_TYPES.PIGEON, 800, 300));
    enemies.push(new Enemy(ENEMY_TYPES.PIGEON, 500, 200));
}

// Update all enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.update();
        
        // Check if stomped on
        enemy.checkStompedOn();
        
        // Check if hit by projectile
        enemy.checkHitByProjectile();
        
        // Check collision with player
        if (enemy.checkCollisionWithPlayer()) {
            takeDamage();
        }
    });
    
    // Remove inactive enemies
    enemies = enemies.filter(enemy => enemy.active);
    
    // Spawn new enemies if too few remain
    if (enemies.length < 3 && game.frameCount % 180 === 0) { // Every 3 seconds
        // Random spawn positions
        const spawnPoints = [
            { x: 300, y: 200 },
            { x: 500, y: 200 },
            { x: 700, y: 200 },
            { x: 400, y: 400 },
            { x: 600, y: 400 },
            { x: 800, y: 300 }
        ];
        
        const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        enemies.push(new Enemy(ENEMY_TYPES.PIGEON, spawn.x, spawn.y));
    }
}

// Draw all enemies
function drawEnemies(ctx) {
    enemies.forEach(enemy => enemy.draw(ctx));
}