import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 800, decimals = 0, suffix = '', prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out expo curve: 1 - Math.pow(2, -10 * progress)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (num - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted = typeof displayValue === 'number'
    ? displayValue.toFixed(decimals)
    : displayValue;

  return (
    <span className="font-mono tabular-nums tracking-tight">
      {prefix}{formatted}{suffix}
    </span>
  );
}
