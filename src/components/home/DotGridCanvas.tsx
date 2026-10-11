'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface Dot {
  x0: number;
  y0: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  speed: number;
  power: number;
}

export function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];
    const ripples: Ripple[] = [];
    const DOT_SPACING = 30;
    const PROXIMITY = 160;

    let mouseX = -9999;
    let mouseY = -9999;
    let isVisible = true;
    let animId: number;

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      dots = [];
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      const offsetX = (width - (cols - 1) * DOT_SPACING) / 2;
      const offsetY = (height - (rows - 1) * DOT_SPACING) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = offsetX + c * DOT_SPACING;
          const y0 = offsetY + r * DOT_SPACING;
          dots.push({
            x0,
            y0,
            x: x0,
            y: y0,
            vx: 0,
            vy: 0,
            baseRadius: 1.15,
            radius: 1.15,
          });
        }
      }

      // If reduced motion, draw once and return
      if (prefersReduced) {
        drawStatic();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(13, 13, 13, 0.12)';
      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.moveTo(d.x0 + d.baseRadius, d.y0);
        ctx.arc(d.x0, d.y0, d.baseRadius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleClick = (e: MouseEvent) => {
      if (prefersReduced) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        maxR: 380,
        speed: 7.5,
        power: 14,
      });
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };

    const render = () => {
      if (prefersReduced) return;

      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // Update ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += rip.speed;
          rip.power *= 0.96;
          if (rip.r >= rip.maxR || rip.power < 0.2) {
            ripples.splice(i, 1);
          }
        }

        ctx.fillStyle = 'rgba(13, 13, 13, 0.13)';
        ctx.beginPath();

        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];

          let targetX = dot.x0;
          let targetY = dot.y0;
          let targetRadius = dot.baseRadius;

          // 1. Mouse repulsion
          const dx = dot.x0 - mouseX;
          const dy = dot.y0 - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < PROXIMITY * PROXIMITY && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const factor = (1 - dist / PROXIMITY);
            const push = factor * 14;
            const nx = dx / dist;
            const ny = dy / dist;
            targetX += nx * push;
            targetY += ny * push;
            targetRadius += factor * 1.2;
          }

          // 2. Ripples displacement
          for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
            const rip = ripples[rIdx];
            const rdx = dot.x0 - rip.x;
            const rdy = dot.y0 - rip.y;
            const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
            const waveDiff = Math.abs(rDist - rip.r);

            if (waveDiff < 36 && rDist > 0.001) {
              const waveFactor = (1 - waveDiff / 36) * (rip.power / 14);
              const rnx = rdx / rDist;
              const rny = rdy / rDist;
              targetX += rnx * (waveFactor * 10);
              targetY += rny * (waveFactor * 10);
              targetRadius += waveFactor * 0.9;
            }
          }

          // Spring physics
          const ax = (targetX - dot.x) * 0.12;
          const ay = (targetY - dot.y) * 0.12;
          dot.vx = (dot.vx + ax) * 0.72;
          dot.vy = (dot.vy + ay) * 0.72;
          dot.x += dot.vx;
          dot.y += dot.vy;

          dot.radius += (targetRadius - dot.radius) * 0.18;

          // Render dot
          ctx.moveTo(dot.x + dot.radius, dot.y);
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        }

        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    initGrid();

    if (!prefersReduced) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('click', handleClick);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      animId = requestAnimationFrame(render);
    }

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initGrid, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 select-none"
      aria-hidden="true"
    />
  );
}
