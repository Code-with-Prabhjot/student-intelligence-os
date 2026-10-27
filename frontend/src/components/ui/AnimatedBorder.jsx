import React from 'react';

/**
 * AnimatedBorder — A glowing, rotating conic-gradient border wrapper
 * Inspired by ReactBits animated border effects
 */
export default function AnimatedBorder({
  children,
  className = '',
  borderWidth = 1,
  glowColor = '59, 130, 246',
  borderRadius = '1rem',
  speed = '3s',
  ...props
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ borderRadius }}
      {...props}
    >
      {/* Spinning conic gradient border */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          borderRadius,
          padding: borderWidth,
          background: `conic-gradient(from var(--angle, 0deg), rgba(${glowColor}, 0) 0%, rgba(${glowColor}, 0.8) 40%, rgba(${glowColor}, 0) 60%)`,
          animation: `spin-border ${speed} linear infinite`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  );
}
