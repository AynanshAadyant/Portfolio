import React, { useEffect, useState } from 'react';

interface DecryptTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  characters?: string;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  speed = 30,
  maxIterations = 10,
  className = '',
  characters = DEFAULT_CHARS,
}) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / (maxIterations / 10);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, characters]);

  return <span className={className}>{displayText}</span>;
};
