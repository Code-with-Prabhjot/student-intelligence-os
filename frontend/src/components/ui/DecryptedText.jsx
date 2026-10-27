import React, { useState, useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  className = '',
  parentClassName = '',
  animateOn = 'hover', // 'hover' | 'view'
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const originalLength = text.length;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            const progress = (iteration / maxIterations) * originalLength;
            const isRevealed =
              revealDirection === 'start'
                ? index < progress
                : index > originalLength - progress;

            if (isRevealed) {
              return text[index];
            }

            const availableChars = useOriginalCharsOnly
              ? text.replace(/\s/g, '')
              : CHARACTERS;

            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration > maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      scramble();
    }
  }, [animateOn]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (animateOn === 'hover') scramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <span
      className={`inline-block cursor-default ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
