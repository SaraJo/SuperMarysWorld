// Tile types
const TILES = {
    EMPTY: 0,
    GROUND: 1,
    BRICK: 2,
    QUESTION: 3,
    PIPE_TOP_LEFT: 4,
    PIPE_TOP_RIGHT: 5,
    PIPE_BODY_LEFT: 6,
    PIPE_BODY_RIGHT: 7,
    BLOCK: 8,
    QUESTION_USED: 9  // Used question block
};

// Tile size
const TILE_SIZE = 32;

// Level 1-1 tilemap (simplified version)
// Each number represents a tile type
// The level is 40 tiles wide and 19 tiles high (to fit 1200x600 canvas)
const level1_1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,3,2,3,2,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,6,7,0,0,0,0,2,2,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,0,0,0,2,2,2,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Draw a single tile
function drawTile(ctx, tileType, x, y) {
    switch(tileType) {
        case TILES.GROUND:
            // Brown ground block
            ctx.fillStyle = '#C84C0C';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#8B3A0A';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.BRICK:
            // Red brick block
            ctx.fillStyle = '#A52A2A';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            // Draw brick pattern
            ctx.strokeStyle = '#8B0000';
            ctx.beginPath();
            ctx.moveTo(x, y + TILE_SIZE/2);
            ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE/2);
            ctx.moveTo(x + TILE_SIZE/2, y);
            ctx.lineTo(x + TILE_SIZE/2, y + TILE_SIZE/2);
            ctx.moveTo(x + TILE_SIZE/2, y + TILE_SIZE/2);
            ctx.lineTo(x + TILE_SIZE/2, y + TILE_SIZE);
            ctx.stroke();
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.QUESTION:
            // Question block (yellow with ?)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#B8860B';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            // Draw question mark
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', x + TILE_SIZE/2, y + TILE_SIZE/2);
            break;
            
        case TILES.PIPE_TOP_LEFT:
            // Green pipe top left
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#006400';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.PIPE_TOP_RIGHT:
            // Green pipe top right
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#006400';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.PIPE_BODY_LEFT:
        case TILES.PIPE_BODY_RIGHT:
            // Green pipe body
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#006400';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.BLOCK:
            // Metal block
            ctx.fillStyle = '#808080';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#696969';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
            
        case TILES.QUESTION_USED:
            // Used question block (brown)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#654321';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
    }
}

// Draw the entire level
function drawLevel(ctx, levelData) {
    for (let row = 0; row < levelData.length; row++) {
        for (let col = 0; col < levelData[row].length; col++) {
            const tileType = levelData[row][col];
            if (tileType !== TILES.EMPTY) {
                drawTile(ctx, tileType, col * TILE_SIZE, row * TILE_SIZE);
            }
        }
    }
}

// Check if a tile is solid (for collision detection)
function isSolidTile(tileType) {
    return tileType !== TILES.EMPTY;
}

// Get tile at world coordinates
function getTileAt(levelData, x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    
    if (row < 0 || row >= levelData.length || col < 0 || col >= levelData[0].length) {
        return TILES.EMPTY;
    }
    
    return levelData[row][col];
}

// Check collision between a rectangle and the level
function checkLevelCollision(levelData, x, y, width, height) {
    // Add small margin to prevent getting stuck
    const margin = 2;
    
    // Check all four corners with margin
    const points = [
        { x: x + margin, y: y + margin },                          // Top-left
        { x: x + width - margin, y: y + margin },                  // Top-right
        { x: x + margin, y: y + height - margin },                 // Bottom-left
        { x: x + width - margin, y: y + height - margin },         // Bottom-right
        { x: x + width/2, y: y + margin },                         // Top-center
        { x: x + width/2, y: y + height - margin },                // Bottom-center
        { x: x + margin, y: y + height/2 },                        // Left-center
        { x: x + width - margin, y: y + height/2 }                 // Right-center
    ];
    
    for (const point of points) {
        const tile = getTileAt(levelData, point.x, point.y);
        if (isSolidTile(tile)) {
            return {
                collided: true,
                tileType: tile,
                tileX: Math.floor(point.x / TILE_SIZE) * TILE_SIZE,
                tileY: Math.floor(point.y / TILE_SIZE) * TILE_SIZE
            };
        }
    }
    
    return { collided: false };
}