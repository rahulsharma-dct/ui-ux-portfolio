import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleOffset: number;
  opacity: number;
}

interface PopParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  decay: number;
}

// Procedural Synth Sound Effect for Bubble Pops using Web Audio API
const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Smooth pop tone
    osc.type = 'sine';
    // Frequency sweeps upwards very quickly to simulate a surface tension pop
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.035);
    
    // Quick volume envelope decaying to zero
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
    
    // Clean up AudioContext resources
    setTimeout(() => {
      audioCtx.close();
    }, 100);
  } catch (e) {
    console.warn("Audio Context blocked or not supported:", e);
  }
};

export const BubbleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubbles = useRef<Bubble[]>([]);
  const particles = useRef<PopParticle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize Bubbles distributed across the whole screen height
    const bubbleCount = 18; // Majestic quantity for large bubbles to avoid clutter
    const tempBubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.random() * 55 + 25; // Radius between 25px and 80px (diameter 50px to 160px)
      tempBubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight, // Distribute initially so they are present on load
        radius,
        speedY: -(Math.random() * 0.35 + 0.2) * (45 / radius + 0.5), // Larger bubbles float slightly slower
        wobbleSpeed: (Math.random() * 0.012 + 0.006) * (45 / radius), // Majestic slower wobble for larger bubbles
        wobbleRange: Math.random() * 8 + radius * 0.18, // Wobble range scales with size
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.18 + 0.18 // Soft translucent appearance
      });
    }
    bubbles.current = tempBubbles;

    // Helper to spawn pop particle spray when a bubble is clicked
    const spawnPopParticles = (x: number, y: number, radius: number, baseOpacity: number) => {
      const particleCount = Math.floor(radius / 4) + 6;
      const newParticles: PopParticle[] = [];
      
      const colors = [
        'rgba(255, 255, 255, 0.95)', // White glare spray
        'rgba(147, 197, 253, 0.85)', // Sky blue shimmer
        'rgba(249, 168, 212, 0.85)', // Magenta shimmer
        'rgba(253, 244, 180, 0.80)', // Yellow shimmer
        'rgba(167, 243, 208, 0.80)'  // Mint green shimmer
      ];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.0, // Slight upward force on burst
          radius: Math.random() * 2 + 1,
          color,
          opacity: baseOpacity + 0.35,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02 // Dissolve animation speed
        });
      }
      particles.current = [...particles.current, ...newParticles];
    };

    // Click handler to pop bubbles
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Avoid popping when clicking window elements, taskbar buttons, inputs or custom menus
      if (
        target.closest('.xp-window') || 
        target.closest('.xp-taskbar-gradient') ||
        target.closest('.xp-start-gradient') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.z-50')
      ) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Trace back-to-front so we pop overlapping ones correctly
      for (let i = bubbles.current.length - 1; i >= 0; i--) {
        const bubble = bubbles.current[i];
        const currentX = bubble.x + Math.sin(bubble.wobbleOffset) * bubble.wobbleRange;
        const dist = Math.hypot(clickX - currentX, clickY - bubble.y);

        if (dist < bubble.radius) {
          playPopSound();
          spawnPopParticles(currentX, bubble.y, bubble.radius, bubble.opacity);

          // Reset the popped bubble to bottom with new parameters
          const radius = Math.random() * 55 + 25;
          bubble.y = canvas.height + radius + Math.random() * 40;
          bubble.x = Math.random() * canvas.width;
          bubble.radius = radius;
          bubble.speedY = -(Math.random() * 0.35 + 0.2) * (45 / radius + 0.5);
          bubble.wobbleSpeed = (Math.random() * 0.012 + 0.006) * (45 / radius);
          bubble.wobbleRange = Math.random() * 8 + radius * 0.18;
          bubble.opacity = Math.random() * 0.18 + 0.18;
          break; // Only pop one bubble per click
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener('mousedown', handleGlobalClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and Update Particles first
      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // Gravity pulling droplets down
        p.life -= p.decay;

        if (p.life <= 0) return false;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * p.opacity;
        ctx.fill();
        ctx.restore();

        return true;
      });

      // 2. Draw and Update Bubbles
      bubbles.current.forEach((bubble) => {
        let currentX = bubble.x + Math.sin(bubble.wobbleOffset) * bubble.wobbleRange;

        // Hover repulsion / pushing bubbles away with the cursor
        const dx = currentX - mouse.current.x;
        const dy = bubble.y - mouse.current.y;
        const distToMouse = Math.hypot(dx, dy);
        const repulsionRadius = bubble.radius + 90;

        if (distToMouse < repulsionRadius) {
          const force = (repulsionRadius - distToMouse) / repulsionRadius;
          const pushX = (dx / distToMouse) * force * 2.8;
          const pushY = (dy / distToMouse) * force * 1.5;

          bubble.x += pushX;
          bubble.y += pushY;

          // Keep in bounds when pushed
          if (bubble.x < bubble.radius) bubble.x = bubble.radius;
          if (bubble.x > canvas.width - bubble.radius) bubble.x = canvas.width - bubble.radius;

          // Violently wobble when disturbed
          bubble.wobbleOffset += bubble.wobbleSpeed * 2.2;
        } else {
          // Slow recovery back to screen center if pushed to extreme edges
          if (bubble.x < bubble.radius * 1.5) bubble.x += 0.15;
          if (bubble.x > canvas.width - bubble.radius * 1.5) bubble.x -= 0.15;
        }

        // Float upwards
        bubble.y += bubble.speedY;
        bubble.wobbleOffset += bubble.wobbleSpeed;

        // Recalculate visual X after movement updates
        currentX = bubble.x + Math.sin(bubble.wobbleOffset) * bubble.wobbleRange;

        // Draw Bubble
        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, bubble.y, bubble.radius, 0, Math.PI * 2);
        
        const highlightX = currentX - bubble.radius * 0.3;
        const highlightY = bubble.y - bubble.radius * 0.3;
        const gradient = ctx.createRadialGradient(
          highlightX, highlightY, bubble.radius * 0.05,
          currentX, bubble.y, bubble.radius
        );
        
        const hueShift = Math.sin(bubble.wobbleOffset) * 20; 
        gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity + 0.15})`);
        gradient.addColorStop(0.35, `hsla(${190 + hueShift}, 80%, 80%, ${bubble.opacity * 0.45})`);
        gradient.addColorStop(0.65, `hsla(${310 + hueShift}, 85%, 82%, ${bubble.opacity * 0.35})`);
        gradient.addColorStop(0.85, `hsla(${50 + hueShift}, 80%, 80%, ${bubble.opacity * 0.25})`);
        gradient.addColorStop(0.95, `rgba(255, 255, 255, ${bubble.opacity * 0.1})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${bubble.opacity * 0.75})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Outline Border
        ctx.beginPath();
        ctx.arc(currentX, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Primary top-left glare
        ctx.beginPath();
        ctx.ellipse(
          highlightX,
          highlightY,
          bubble.radius * 0.25,
          bubble.radius * 0.12,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity + 0.35})`;
        ctx.fill();

        // Secondary bottom-right glare
        const secHighlightX = currentX + bubble.radius * 0.35;
        const secHighlightY = bubble.y + bubble.radius * 0.35;
        ctx.beginPath();
        ctx.ellipse(
          secHighlightX,
          secHighlightY,
          bubble.radius * 0.12,
          bubble.radius * 0.06,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.4})`;
        ctx.fill();

        ctx.restore();

        // Reset offscreen bubbles to bottom
        if (bubble.y + bubble.radius < 0) {
          const radius = Math.random() * 55 + 25;
          bubble.y = canvas.height + radius + Math.random() * 40;
          bubble.x = Math.random() * canvas.width;
          bubble.radius = radius;
          bubble.speedY = -(Math.random() * 0.35 + 0.2) * (45 / radius + 0.5);
          bubble.wobbleSpeed = (Math.random() * 0.012 + 0.006) * (45 / radius);
          bubble.wobbleRange = Math.random() * 8 + radius * 0.18;
          bubble.opacity = Math.random() * 0.18 + 0.18;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousedown', handleGlobalClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};


