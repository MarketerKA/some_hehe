import { questData } from '../../data/questData';
import './CompletionScreen.scss';

interface CompletionScreenProps {
  onReset?: () => void;
}

const CompletionScreen = ({ onReset }: CompletionScreenProps) => {
  return (
    <div className="completion-screen">
      <div className="completion-content">
        <div className="celebration">
          <div className="heart">💖</div>
          <div className="heart">💕</div>
          <div className="heart">💗</div>
        </div>

        <h1 className="completion-title">{questData.completionMessage}</h1>
        
        <div className="completion-message">
          <p>Ты прошла все 5 этапов квеста!</p>
          <p>Надеюсь, тебе понравилось это приключение 🌟</p>
        </div>

        {onReset && (
          <button className="reset-button" onClick={onReset}>
            Начать заново
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletionScreen;
