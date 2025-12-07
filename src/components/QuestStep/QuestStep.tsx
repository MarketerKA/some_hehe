import { useState } from 'react';
import CodeInput from '../CodeInput/CodeInput';
import SuccessAnimation from '../SuccessAnimation/SuccessAnimation';
import './QuestStep.scss';

interface QuestStepProps {
  stepNumber: number;
  title: string;
  description: string;
  onCodeSubmit: (code: string) => Promise<boolean>;
  isValidating: boolean;
  difficulty: number;
  image?: string;
}

const QuestStep = ({ stepNumber, title, description, onCodeSubmit, isValidating, difficulty, image }: QuestStepProps) => {
  const [error, setError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCodeSubmit = async (code: string) => {
    setError(false);
    const isValid = await onCodeSubmit(code);
    
    if (isValid) {
      setShowSuccess(true);
      // Reset success state after animation completes and transition happens
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      setError(true);
    }
  };

  const getDifficultyEmoji = (level: number) => {
    return '🔥'.repeat(level);
  };

  if (showSuccess) {
    return (
      <div className="quest-step">
        <SuccessAnimation />
      </div>
    );
  }

  return (
    <div className="quest-step">
      <div className="step-header">
        <div className="step-progress">Этап {stepNumber} из 11</div>
        <div className="difficulty-indicator">{getDifficultyEmoji(difficulty)}</div>
        <h2 className="step-title">{title}</h2>
      </div>

      <div className="step-content">
        <p className="step-description">{description}</p>
        {image && (
          <div className="step-image">
            <img src={image} alt={title} />
          </div>
        )}
      </div>

      <div className="step-input">
        <CodeInput
          onSubmit={handleCodeSubmit}
          isValidating={isValidating}
          error={error}
          stepNumber={stepNumber}
        />
      </div>
    </div>
  );
};

export default QuestStep;
