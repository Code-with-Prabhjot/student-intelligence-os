import React from 'react';

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text select-none ${
        disabled ? '' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, currentColor 35%, rgba(255, 255, 255, 0.95) 50%, currentColor 65%)',
        backgroundSize: '220% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
