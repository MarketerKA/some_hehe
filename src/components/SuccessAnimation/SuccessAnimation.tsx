import { useEffect, useMemo } from 'react';
import './SuccessAnimation.scss';

interface SuccessAnimationProps {
  onComplete?: () => void;
}

const successMessages = [
  'Верно! 🎉',
  'Отлично! 💖',
  'Молодец! ✨',
  'Супер! 🌟',
  'Прекрасно! 💕',
  'Умница! 🎊',
  'Великолепно! 💫',
  'Браво! 🎈',
];

const SuccessAnimation = ({ onComplete }: SuccessAnimationProps) => {
  const randomMessage = useMemo(() => {
    return successMessages[Math.floor(Math.random() * successMessages.length)];
  }, []);

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="success-animation">
      <div className="checkmark-circle">
        <svg className="checkmark" viewBox="0 0 52 52">
          <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
      <p className="success-text">{randomMessage}</p>
    </div>
  );
};

export default SuccessAnimation;
