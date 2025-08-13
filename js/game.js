// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const GROUND_HEIGHT = 60;
const SCALE = 2; // Make everything 2x bigger

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game state
const game = {
    running: false,
    score: 0,
    lives: 3,
    timer: 400,
    frameCount: 0,
    won: false
};

// Mary (player) object
const mary = {
    x: 100,
    y: 400,  // Start position (will fall to ground)
    width: 16 * SCALE,
    height: 16 * SCALE,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    isJumping: false,
    isBig: false,
    hasBat: false,
    invulnerable: false,
    invulnerableTime: 0,
    lastDirection: 1  // 1 for right, -1 for left
};

// Game physics
const physics = {
    gravity: 0.8,
    friction: 0.9
};

// Keyboard state
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    fire: false
};

// Simple pixel art for Mary (16x16 base, scaled up)
function drawMarySprite(x, y, isBig) {
    const spriteScale = SCALE * (isBig ? 2 : 1);
    
    if (isBig) {
        // Draw Mets hat on big Mary
        // Cap crown (rounded top)
        ctx.fillStyle = '#002D72'; // Mets blue
        ctx.beginPath();
        ctx.arc(x + 8*spriteScale, y + 2*spriteScale, 6*spriteScale, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();
        
        // Cap base
        ctx.fillRect(x + 2*spriteScale, y + 2*spriteScale, 12*spriteScale, 3*spriteScale);
        
        // Hat brim
        ctx.fillStyle = '#002D72';
        ctx.fillRect(x + 1*spriteScale, y + 4*spriteScale, 14*spriteScale, 2*spriteScale);
        
        // Mets logo (stylized NY)
        ctx.strokeStyle = '#FF5910';
        ctx.lineWidth = spriteScale;
        ctx.lineCap = 'round';
        
        // Draw stylized N
        ctx.beginPath();
        ctx.moveTo(x + 4*spriteScale, y + 4.5*spriteScale);
        ctx.lineTo(x + 4*spriteScale, y + 2*spriteScale);
        ctx.lineTo(x + 6*spriteScale, y + 4.5*spriteScale);
        ctx.lineTo(x + 6*spriteScale, y + 2*spriteScale);
        ctx.stroke();
        
        // Draw stylized Y
        ctx.beginPath();
        ctx.moveTo(x + 9*spriteScale, y + 2*spriteScale);
        ctx.lineTo(x + 10*spriteScale, y + 3*spriteScale);
        ctx.lineTo(x + 11*spriteScale, y + 2*spriteScale);
        ctx.moveTo(x + 10*spriteScale, y + 3*spriteScale);
        ctx.lineTo(x + 10*spriteScale, y + 4.5*spriteScale);
        ctx.stroke();
    } else {
        // Hair (brown) - only for small Mary
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 4*spriteScale, y + 0*spriteScale, 8*spriteScale, 4*spriteScale);
    }
    
    // Face (peach)
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(x + 4*spriteScale, y + 4*spriteScale, 8*spriteScale, 6*spriteScale);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 5*spriteScale, y + 5*spriteScale, 2*spriteScale, 2*spriteScale);
    ctx.fillRect(x + 9*spriteScale, y + 5*spriteScale, 2*spriteScale, 2*spriteScale);
    
    // Shirt (red for normal, white for bat power)
    ctx.fillStyle = mary.hasBat ? '#FFFFFF' : '#FF0000';
    ctx.fillRect(x + 3*spriteScale, y + 10*spriteScale, 10*spriteScale, 4*spriteScale);
    
    // Draw 'B' on shirt if has bat power
    if (mary.hasBat) {
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${4*spriteScale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', x + 8*spriteScale, y + 12*spriteScale);
    }
    
    // Pants (blue)
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(x + 4*spriteScale, y + 14*spriteScale, 8*spriteScale, 2*spriteScale);
    
    // Shoes (black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 3*spriteScale, y + 15*spriteScale, 4*spriteScale, 1*spriteScale);
    ctx.fillRect(x + 9*spriteScale, y + 15*spriteScale, 4*spriteScale, 1*spriteScale);
}

// Handle window resize
function handleResize() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const aspectRatio = GAME_WIDTH / GAME_HEIGHT;
    
    // Calculate new dimensions maintaining aspect ratio
    let newWidth = containerWidth;
    let newHeight = newWidth / aspectRatio;
    
    // Set canvas CSS size (displayed size)
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
}

// Keyboard event handlers
function handleKeyDown(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = true;
            e.preventDefault();
            break;
        case 'ArrowUp':
        case ' ':
            keys.space = true;
            e.preventDefault();
            break;
        case 'ArrowDown':
            keys.down = true;
            e.preventDefault();
            break;
        case 'x':
        case 'X':
            if (!keys.fire) {  // Prevent auto-repeat
                keys.fire = true;
                fireBaseball();
            }
            e.preventDefault();
            break;
    }
}

function handleKeyUp(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
        case ' ':
            keys.space = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
        case 'x':
        case 'X':
            keys.fire = false;
            break;
    }
}

// Handle Mary taking damage
function takeDamage() {
    if (mary.invulnerable) return;
    
    if (mary.hasBat) {
        // Lose bat power
        mary.hasBat = false;
    } else if (mary.isBig) {
        // Shrink from big to small
        mary.isBig = false;
        mary.height = 16 * SCALE;
        mary.y += 16 * SCALE;  // Adjust position
    } else {
        // Lose a life
        game.lives--;
        document.getElementById('lives').textContent = game.lives;
        
        if (game.lives <= 0) {
            // Game over
            game.running = false;
            alert('Game Over!');
        }
    }
    
    // Make Mary invulnerable for a short time
    mary.invulnerable = true;
    mary.invulnerableTime = 120;  // 2 seconds at 60fps
    
    // Damage effects
    soundManager.play('damage');
}

// Game initialization
function init() {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Initialize collectibles
    initializeCollectibles();
    
    // Initialize enemies
    initializeEnemies();
    
    game.running = true;
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!game.running) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update game state
    update();
    
    // Render everything
    render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Update game logic
function update() {
    game.frameCount++;
    
    // Update timer (60 fps, so every 60 frames = 1 second)
    if (game.frameCount % 60 === 0) {
        game.timer--;
        document.getElementById('timer').textContent = game.timer;
    }
    
    // Handle horizontal movement
    if (keys.left) {
        mary.velocityX = -mary.speed;
        mary.lastDirection = -1;
    } else if (keys.right) {
        mary.velocityX = mary.speed;
        mary.lastDirection = 1;
    } else {
        mary.velocityX *= physics.friction;
        // Stop completely if velocity is very small
        if (Math.abs(mary.velocityX) < 0.1) {
            mary.velocityX = 0;
        }
    }
    
    // Handle jumping
    if (keys.space && !mary.isJumping) {
        // Jump higher when big
        const jumpMultiplier = mary.isBig ? 1.3 : 1;
        mary.velocityY = -mary.jumpPower * jumpMultiplier;
        mary.isJumping = true;
        
        // Jump effects
        soundManager.play('jump');
        createParticles(mary.x + mary.width/2, mary.y + mary.height, 'jump', 3);
    }
    
    // Apply gravity
    mary.velocityY += physics.gravity;
    
    // Store old position for collision resolution
    const oldX = mary.x;
    const oldY = mary.y;
    
    // Update horizontal position and check collision
    mary.x += mary.velocityX;
    
    // Only check for collision if Mary actually moved
    if (Math.abs(mary.velocityX) > 0) {
        let collision = checkLevelCollision(level1_1, mary.x, mary.y, mary.width, mary.height);
        if (collision.collided) {
            // Resolve horizontal collision
            mary.x = oldX;
            mary.velocityX = 0;
        }
    }
    
    // Update vertical position and check collision
    mary.y += mary.velocityY;
    collision = checkLevelCollision(level1_1, mary.x, mary.y, mary.width, mary.height);
    if (collision.collided) {
        // Resolve vertical collision
        if (mary.velocityY > 0) {
            // Falling down - land on top of tile
            mary.y = collision.tileY - mary.height;
            mary.isJumping = false;
        } else {
            // Jumping up - hit bottom of tile
            mary.y = collision.tileY + TILE_SIZE;
            
            // Check if we hit a question block
            if (collision.tileType === TILES.QUESTION) {
                // Convert question block to used block
                const tileCol = Math.floor((collision.tileX + TILE_SIZE/2) / TILE_SIZE);
                const tileRow = Math.floor((collision.tileY + TILE_SIZE/2) / TILE_SIZE);
                level1_1[tileRow][tileCol] = TILES.QUESTION_USED;
                
                // Determine what to spawn based on position
                let itemType;
                if (tileCol === 11) {
                    itemType = COLLECTIBLES.SUBWAY_TOKEN;
                } else if (tileCol === 9 || tileCol === 10) {
                    itemType = COLLECTIBLES.BASEBALL_BAT;  // Baseball bats from middle blocks
                } else {
                    itemType = COLLECTIBLES.METS_HAT;
                }
                
                collectibles.push(new Collectible(
                    itemType,
                    collision.tileX + 4,
                    collision.tileY - TILE_SIZE
                ));
            }
        }
        mary.velocityY = 0;
    } else {
        // Check if there's ground beneath Mary (for setting isJumping)
        const groundCheck = checkLevelCollision(level1_1, mary.x, mary.y + 1, mary.width, mary.height);
        mary.isJumping = !groundCheck.collided;
    }
    
    // Keep Mary within screen bounds
    if (mary.x < 0) {
        mary.x = 0;
        mary.velocityX = 0;
    } else if (mary.x > GAME_WIDTH - mary.width) {
        mary.x = GAME_WIDTH - mary.width;
        mary.velocityX = 0;
    }
    
    // Update collectibles
    updateCollectibles();
    
    // Update projectiles
    updateProjectiles();
    
    // Update enemies
    updateEnemies();
    
    // Update particles
    updateParticles();
    
    // Update invulnerability
    if (mary.invulnerable) {
        mary.invulnerableTime--;
        if (mary.invulnerableTime <= 0) {
            mary.invulnerable = false;
        }
    }
    
    // Check win condition - reaching the 7 train
    if (mary.x >= 1050 && mary.x <= 1170 && mary.y >= 400 && !game.won) {
        game.won = true;
        game.running = false;
        
        // Victory effects
        soundManager.play('win');
        createParticles(mary.x + mary.width/2, mary.y + mary.height/2, 'powerup', 20);
        
        // Show victory message
        setTimeout(() => {
            alert(`You Win!\nScore: ${game.score}\nTime: ${game.timer}\n\nMary caught the 7 train to Queens!`);
        }, 100);
    }
}

// Draw the 7 train at end of level
function drawSubwayTrain(x, y) {
    // Train car body (gray)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(x, y, 120, 80);
    
    // Train car outline
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 120, 80);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 10, y + 10, 25, 30);
    ctx.fillRect(x + 45, y + 10, 25, 30);
    ctx.fillRect(x + 80, y + 10, 25, 30);
    
    // Door
    ctx.fillStyle = '#696969';
    ctx.fillRect(x + 40, y + 45, 40, 35);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(x + 40, y + 45, 40, 35);
    
    // Door window
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 50, y + 50, 20, 15);
    
    // 7 train logo (purple circle)
    ctx.fillStyle = '#B933AD';
    ctx.beginPath();
    ctx.arc(x + 60, y + 25, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Number 7
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('7', x + 60, y + 25);
    
    // Platform edge
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - 20, y + 80, 160, 5);
    
    // "STAND CLEAR" text
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('STAND CLEAR OF CLOSING DOORS', x + 60, y + 90);
}

// Draw NYC skyline background
function drawSkyline(ctx) {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#5C94FC');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Buildings in background (parallax layer)
    ctx.fillStyle = '#404040';
    const buildings = [
        { x: 50, h: 200 },
        { x: 150, h: 250 },
        { x: 250, h: 180 },
        { x: 350, h: 220 },
        { x: 450, h: 260 },
        { x: 550, h: 190 },
        { x: 650, h: 240 },
        { x: 750, h: 200 },
        { x: 850, h: 270 },
        { x: 950, h: 210 },
        { x: 1050, h: 230 }
    ];
    
    buildings.forEach(building => {
        ctx.fillRect(building.x, 400 - building.h, 80, building.h);
        
        // Windows
        ctx.fillStyle = '#FFD700';
        for (let y = 0; y < building.h - 20; y += 30) {
            for (let x = 0; x < 60; x += 20) {
                if (Math.random() > 0.3) { // Some windows are lit
                    ctx.fillRect(building.x + x + 10, 400 - building.h + y + 10, 8, 12);
                }
            }
        }
        ctx.fillStyle = '#404040';
    });
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const cloudOffset = (game.frameCount * 0.1) % GAME_WIDTH;
    ctx.beginPath();
    ctx.arc(100 + cloudOffset, 80, 25, 0, Math.PI * 2);
    ctx.arc(130 + cloudOffset, 80, 35, 0, Math.PI * 2);
    ctx.arc(160 + cloudOffset, 80, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(400 + cloudOffset, 120, 20, 0, Math.PI * 2);
    ctx.arc(425 + cloudOffset, 120, 30, 0, Math.PI * 2);
    ctx.arc(450 + cloudOffset, 120, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Render game objects
function render() {
    // Draw NYC skyline background
    drawSkyline(ctx);
    
    // Draw level tiles
    drawLevel(ctx, level1_1);
    
    // Draw subway train at end of level
    drawSubwayTrain(1050, 460);
    
    // Draw collectibles
    drawCollectibles(ctx);
    
    // Draw enemies
    drawEnemies(ctx);
    
    // Draw particles (behind projectiles)
    drawParticles(ctx);
    
    // Draw projectiles
    drawProjectiles(ctx);
    
    // Draw Mary sprite (flashing if invulnerable)
    if (!mary.invulnerable || Math.floor(game.frameCount / 5) % 2 === 0) {
        drawMarySprite(mary.x, mary.y, mary.isBig);
    }
}

// Start the game when page loads
window.addEventListener('load', init);