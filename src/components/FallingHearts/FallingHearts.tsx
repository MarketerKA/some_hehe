import { useEffect, useState } from 'react';
import './FallingHearts.scss';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

const FallingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));

    setHearts(newHearts);
  }, []);

  return (
    <div className="falling-hearts-container">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="falling-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FallingHearts;
