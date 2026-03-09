export function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let mouse = { x: null, y: null, radius: 150 };

  function init() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = [];
    
    // Adjust particle count based on screen size to maintain performance
    const numParticles = Math.floor((w * h) / 12000); 

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() * 1) - 0.5;
      this.speedY = (Math.random() * 1) - 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 20) + 1;
      this.color = '#1665d8'; // Primary blue
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x > w || this.x < 0) this.speedX = -this.speedX;
      if (this.y > h || this.y < 0) this.speedY = -this.speedY;

      // Mouse repulsion
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * (this.density / 2);
          let directionY = forceDirectionY * force * (this.density / 2);
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = `rgba(22, 101, 216, ${opacityValue * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      
      // Also draw lines to the mouse
      if (mouse.x != null && mouse.y != null) {
        let dmx = particles[a].x - mouse.x;
        let dmy = particles[a].y - mouse.y;
        let mouseDistance = Math.sqrt(dmx * dmx + dmy * dmy);
        
        if (mouseDistance < 150) {
          opacityValue = 1 - (mouseDistance / 150);
          ctx.strokeStyle = `rgba(15, 139, 141, ${opacityValue * 0.6})`; // Accent color for mouse lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  init();
  animate();
}
