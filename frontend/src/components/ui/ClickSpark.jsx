import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function ClickSpark({
  sparkColor = '#3b82f6',
  sparkSize = 10,
  sparkRadius = 20,
  sparkCount = 8,
  duration = 450,
  children,
  className = '',
}) {
  const [sparks, setSparks] = useState([]);

  const handleClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();

      const newSparks = Array.from({ length: sparkCount }).map((_, i) => {
        const angle = (2 * Math.PI * i) / sparkCount;
        return {
          id: `${id}-${i}`,
          x,
          y,
          dx: Math.cos(angle) * sparkRadius,
          dy: Math.sin(angle) * sparkRadius,
        };
      });

      setSparks((prev) => [...prev, ...newSparks]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
      }, duration);
    },
    [sparkCount, sparkRadius, duration]
  );

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block overflow-visible ${className}`}
    >
      {children}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="pointer-events-none absolute rounded-full transition-all ease-out"
          style={{
            left: spark.x,
            top: spark.y,
            width: `${sparkSize}px`,
            height: `${sparkSize}px`,
            backgroundColor: sparkColor,
            transform: `translate(${spark.dx}px, ${spark.dy}px) scale(0)`,
            transitionDuration: `${duration}ms`,
            opacity: 0,
            boxShadow: `0 0 8px ${sparkColor}`,
          }}
        />
      ))}
    </div>
  );
}
