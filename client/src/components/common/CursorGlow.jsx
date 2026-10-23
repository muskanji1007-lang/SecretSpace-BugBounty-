import React, { useEffect, useState, useRef } from 'react';

/**
 * CursorGlow Component (Inspired by bonkersUI.com cursor-reactive ambient lighting)
 * Smoothly tracks the user's mouse pointer and renders a soft Cherry Noir specular glow.
 * Automatically disabled on touchscreen / mobile devices for zero performance overhead.
 */
export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const animFrameRef = useRef(null);
  const targetPosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Detect touchscreen devices or reduced motion preference
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const handlePointerMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          setPosition(targetPosRef.current);
          animFrameRef.current = null;
        });
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(650px circle at ${position.x}px ${position.y}px, rgba(244, 63, 94, 0.08), rgba(139, 92, 246, 0.03) 40%, transparent 80%)`,
      }}
    />
  );
}
