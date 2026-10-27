import React, { useEffect, useState, useRef } from 'react';

export default function CountUp({
  to,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const [currentValue, setCurrentValue] = useState(from);
  const startRef = useRef(from);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const startVal = startRef.current;
    const endVal = Number(to) || 0;
    const durationMs = duration * 1000;

    const easeOutQuad = (t) => t * (2 - t);

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutQuad(progress);

      const val = startVal + (endVal - startVal) * easedProgress;
      setCurrentValue(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        startRef.current = endVal;
        startTimeRef.current = null;
      }
    };

    startTimeRef.current = null;
    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [to, duration]);

  const formatted = decimals > 0 ? currentValue.toFixed(decimals) : Math.round(currentValue);

  return (
    <span className={`inline-block tabular-nums font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
