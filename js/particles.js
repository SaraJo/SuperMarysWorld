// Particle system for visual effects
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.lifetime = 30;
        
        switch(type) {
            case 'brick':
                // Brick debris
                this.velocityX = (Math.random() - 0.5) * 8;
                this.velocityY = -Math.random() * 8 - 2;
                this.size = Math.random() * 4 + 2;
                this.color = '#A52A2A';
                this.gravity = 0.5;
                break;
                
            case 'token':
                // Token collection sparkle
                this.velocityX = (Math.random() - 0.5) * 4;
                this.velocityY = -Math.random() * 4;
                this.size = Math.random() * 3 + 1;
                this.color = '#FFD700';
                this.gravity = -0.1;
                this.lifetime = 20;
                break;
                
            case 'jump':
                // Jump dust
                this.velocityX = (Math.random() - 0.5) * 2;
                this.velocityY = Math.random() * 2;
                this.size = Math.random() * 3 + 2;
                this.color = '#C84C0C';
                this.gravity = 0.1;
                this.lifetime = 15;
                break;
                
            case 'stomp':
                // Enemy defeat stars
                this.velocityX = (Math.random() - 0.5) * 6;
                this.velocityY = -Math.random() * 6;
                this.size = 4;
                this.color = '#FFFF00';
                this.gravity = 0.3;
                this.lifetime = 25;
                break;
                
            case 'powerup':
                // Power-up collection
                this.velocityX = (Math.random() - 0.5) * 3;
                this.velocityY = -Math.random() * 5 - 2;
                this.size = Math.random() * 4 + 2;
                this.color = Math.random() > 0.5 ? '#002D72' : '#FF5910'; // Mets colors
                this.gravity = 0.2;
                this.lifetime = 40;
                break;
        }
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.active = false;
        }
        
        // Fade out
        this.alpha = this.lifetime / 30;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (this.type === 'stomp') {
            // Draw star shape
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.lifetime * 0.2);
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const innerAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
                if (i === 0) {
                    ctx.moveTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                } else {
                    ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                }
                ctx.lineTo(Math.cos(innerAngle) * this.size * 0.5, Math.sin(innerAngle) * this.size * 0.5);
            }
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw circle/square particles
            ctx.fillStyle = this.color;
            if (this.type === 'brick') {
                ctx.fillRect(this.x, this.y, this.size, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
}

// Active particles
let particles = [];

// Create particles
function createParticles(x, y, type, count = 5) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, type));
    }
}

// Update all particles
function updateParticles() {
    particles.forEach(particle => particle.update());
    particles = particles.filter(particle => particle.active);
}

// Draw all particles
function drawParticles(ctx) {
    particles.forEach(particle => particle.draw(ctx));
}

// Sound effects using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initSounds();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    initSounds() {
        if (!this.enabled) return;
        
        // Define sound effects as frequency patterns
        this.sounds = {
            jump: { frequency: [400, 600, 800], duration: 0.15 },
            coin: { frequency: [800, 1200, 1000, 1400], duration: 0.2 },
            powerup: { frequency: [400, 500, 600, 700, 800], duration: 0.3 },
            stomp: { frequency: [200, 150, 100], duration: 0.2 },
            break: { frequency: [150, 100, 80], duration: 0.15 },
            shoot: { frequency: [800, 600, 400], duration: 0.1 },
            damage: { frequency: [200, 150, 200, 150], duration: 0.3 },
            win: { frequency: [523, 659, 784, 1047], duration: 0.5 }
        };
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        gainNode.gain.value = 0.1;
        
        const timePerNote = sound.duration / sound.frequency.length;
        sound.frequency.forEach((freq, index) => {
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * timePerNote);
        });
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    }
}

// Create sound manager instance
const soundManager = new SoundManager();