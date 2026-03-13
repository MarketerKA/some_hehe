import { useEffect, useState } from 'react';
import './HeartsAnimation.scss';

interface Heart {
  id: number;
  x: number;
  y: number;
}

interface HeartsAnimationProps {
  triggerX: number;
  triggerY: number;
  onComplete?: () => void;
}

const HeartsAnimation = ({ triggerX, triggerY, onComplete }: HeartsAnimationProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: triggerX,
      y: triggerY,
    }));

    setHearts(newHearts);

    if (onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [triggerX, triggerY, onComplete]);

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-animation"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
};

export default HeartsAnimation;
