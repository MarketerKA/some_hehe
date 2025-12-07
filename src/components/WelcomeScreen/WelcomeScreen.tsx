import { questData } from '../../data/questData';
import './WelcomeScreen.scss';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">{questData.welcomeMessage}</h1>
        
        <div className="welcome-description">
          <p>Тебя ждет увлекательное приключение из 11 этапов.</p>
          <p>На каждом этапе выполни задание и получи код для перехода к следующему.</p>
          <p>Твой прогресс будет сохранен, так что можешь проходить квест в своем темпе.</p>
        </div>

        <button className="start-button" onClick={onStart}>
          Начать квест
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
