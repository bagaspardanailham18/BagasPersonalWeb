import React, { useEffect, useRef } from 'react';

export function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let meteors: Meteor[] = [];
    let animationFrameId: number;

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', initCanvas);
    initCanvas();

    class Meteor {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speed: number = 0;
      angle: number = 0;
      opacity: number = 0;
      thickness: number = 0;
      active: boolean = false;

      constructor() {
        this.reset();
      }

      reset() {
        if (Math.random() > 0.5) {
          this.x = Math.random() * width;
          this.y = -100;
        } else {
          this.x = -100;
          this.y = Math.random() * (height * 0.5);
        }
        this.length = Math.random() * 150 + 80;
        this.speed = Math.random() * 10 + 4;
        this.angle = (Math.PI / 180) * (Math.random() * 10 + 35);
        this.opacity = Math.random() * 0.4 + 0.1;
        this.thickness = Math.random() * 2.5 + 1.5;
        this.active = false;
        setTimeout(() => {
          this.active = true;
        }, Math.random() * 5000);
      }

      update() {
        if (!this.active) return;
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.x > width + 200 || this.y > height + 200) {
          this.active = false;
          setTimeout(() => {
            this.reset();
            this.active = true;
          }, Math.random() * 4000 + 1000);
        }
      }

      draw() {
        if (!this.active || !ctx) return;
        const tailX = this.x - this.length * Math.cos(this.angle);
        const tailY = this.y - this.length * Math.sin(this.angle);
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);
        
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.15})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 15; i++) {
      meteors.push(new Meteor());
    }

    const animateMeteors = () => {
      ctx.clearRect(0, 0, width, height);
      meteors.forEach((m) => {
        m.update();
        m.draw();
      });
      animationFrameId = requestAnimationFrame(animateMeteors);
    };
    
    animateMeteors();

    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-40"
    />
  );
}
