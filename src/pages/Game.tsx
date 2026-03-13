import { useState, useEffect } from 'react';
import helloVideo from '../assets/hello.webm';
import game1Tgs from '../assets/game1.tgs';
import game2Tgs from '../assets/game2.tgs';
import game3Video from '../assets/game3.webm';
import game4Video from '../assets/game4.webm';
import sr1 from '../assets/sr1.jpg';
import sr2 from '../assets/sr2.jpg';
import sr3 from '../assets/sr3.jpg';
import HeartsAnimation from '../components/HeartsAnimation/HeartsAnimation';
import TgsAnimation from '../components/TgsAnimation/TgsAnimation';
import PraiseTransition from '../components/PraiseTransition/PraiseTransition';
import './Game.scss';

type GameStep = 'welcome' | 'question1' | 'transition1' | 'question2' | 'transition2' | 'question3' | 'transition3' | 'question4' | 'transition4' | 'question5' | 'transition5' | 'certificates';

const GAME_STORAGE_KEY = 'romantic-game-progress';

const getStoredGameProgress = (): GameStep | null => {
  try {
    const stored = localStorage.getItem(GAME_STORAGE_KEY);
    return stored ? (stored as GameStep) : null;
  } catch {
    return null;
  }
};

const saveGameProgress = (step: GameStep): void => {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, step);
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

function Game() {
  const [step, setStep] = useState<GameStep>(() => {
    return getStoredGameProgress() || 'welcome';
  });
  const [heartsPos, setHeartsPos] = useState<{ x: number; y: number } | null>(null);
  const [noButtonPos, setNoButtonPos] = useState<{ top: number | null; left: number | null }>({ 
    top: null, 
    left: null 
  });
  const [isNoButtonInitialized, setIsNoButtonInitialized] = useState(false);
  const [isNo2ButtonInitialized, setIsNo2ButtonInitialized] = useState(false);
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);
  const [error4, setError4] = useState(false);
  const [no2ButtonPos, setNo2ButtonPos] = useState<{ top: number | null; left: number | null }>({ 
    top: null, 
    left: null 
  });
  const [currentCertificate, setCurrentCertificate] = useState(0);

  const certificates = [
    { id: 1, image: sr1, name: 'Сертификат #1' },
    { id: 2, image: sr2, name: 'Сертификат #2' },
    { id: 3, image: sr3, name: 'Сертификат #3' },
  ];

  // Save progress whenever step changes
  useEffect(() => {
    saveGameProgress(step);
  }, [step]);

  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    setHeartsPos({ x: buttonX, y: buttonY });

    setTimeout(() => {
      setStep('question1');
      setHeartsPos(null);
    }, 1000);
  };

  const handleYes = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    setHeartsPos({ x: buttonX, y: buttonY });
    setStep('transition1');

    setTimeout(() => {
      setStep('question2');
      setHeartsPos(null);
    }, 3500);
  };

  const handleNoHover = () => {
    if (!isNoButtonInitialized) {
      setIsNoButtonInitialized(true);
    }
    
    const newTop = Math.random() * 70 + 15;
    const newLeft = Math.random() * 70 + 15;
    setNoButtonPos({ top: newTop, left: newLeft });
  };

  const handleAnswer2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer2 === '77') {
      setError2(false);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setHeartsPos({ x: centerX, y: centerY });
      setStep('transition2');

      setTimeout(() => {
        setStep('question3');
        setHeartsPos(null);
      }, 3500);
    } else {
      setError2(true);
    }
  };

  const handleAnswer3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer3 === '143') {
      setError3(false);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setHeartsPos({ x: centerX, y: centerY });
      setStep('transition3');

      setTimeout(() => {
        setStep('question4');
        setHeartsPos(null);
      }, 3500);
    } else {
      setError3(true);
    }
  };

  const handleAnswer4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer4 === '14.08.2024') {
      setError4(false);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setHeartsPos({ x: centerX, y: centerY });
      setStep('transition4');

      setTimeout(() => {
        setStep('question5');
        setHeartsPos(null);
      }, 3500);
    } else {
      setError4(true);
    }
  };

  const handleYes2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    setHeartsPos({ x: buttonX, y: buttonY });
    setStep('transition5');

    setTimeout(() => {
      setStep('certificates');
      setHeartsPos(null);
    }, 3500);
  };

  const handleNo2Hover = () => {
    if (!isNo2ButtonInitialized) {
      setIsNo2ButtonInitialized(true);
    }
    
    const newTop = Math.random() * 70 + 15;
    const newLeft = Math.random() * 70 + 15;
    setNo2ButtonPos({ top: newTop, left: newLeft });
  };

  const handlePrevCertificate = () => {
    setCurrentCertificate((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const handleNextCertificate = () => {
    setCurrentCertificate((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
  };

  const handleDownloadCertificate = () => {
    const link = document.createElement('a');
    link.href = certificates[currentCertificate].image;
    link.download = `certificate_${currentCertificate + 1}.jpg`;
    link.click();
  };

  // Welcome screen
  if (step === 'welcome') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Привет Ксюшенька ❤️</h1>
          
          <div className="video-container">
            <video autoPlay loop muted playsInline>
              <source src={helloVideo} type="video/webm" />
            </video>
          </div>

          <button className="game-start-button" onClick={handleStart}>
            НАЧАТЬ
          </button>
        </div>

        {heartsPos && <HeartsAnimation triggerX={heartsPos.x} triggerY={heartsPos.y} />}
      </div>
    );
  }

  // Question 1
  if (step === 'question1') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Ксюшенька у меня самая красивая???</h1>
          
          <div className="video-container tgs-container">
            <TgsAnimation src={game1Tgs} />
          </div>

          <div className="buttons-container">
            <button className="game-yes-button" onClick={handleYes}>
              Дя
            </button>
            <button 
              className={`game-no-button ${isNoButtonInitialized ? 'floating' : ''}`}
              style={
                isNoButtonInitialized 
                  ? { top: `${noButtonPos.top}%`, left: `${noButtonPos.left}%` }
                  : {}
              }
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
            >
              Неть
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transition 1
  if (step === 'transition1') {
    return (
      <div className="game-container">
        <PraiseTransition text="Ты у меня самая красивая! ❤️" useFallingHearts />
      </div>
    );
  }

  // Question 2
  if (step === 'question2') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Сколько раз в чате было сказано слово "Красотка"?</h1>
          
          <div className="video-container tgs-container">
            <TgsAnimation src={game2Tgs} />
          </div>

          <form className="answer-form" onSubmit={handleAnswer2Submit}>
            <input
              type="number"
              className={`answer-input ${error2 ? 'error' : ''}`}
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              placeholder="Введи число"
            />
            {error2 && <p className="error-text">Неправильно, попробуй еще раз!</p>}
            <button type="submit" className="game-start-button">
              Ответить
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Transition 2
  if (step === 'transition2') {
    return (
      <div className="game-container">
        <PraiseTransition text="Умничка! Ты все помнишь! 🌟" useFallingHearts />
      </div>
    );
  }

  // Question 3
  if (step === 'question3') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Сколько раз было сказано "Милая"?</h1>
          
          <div className="video-container">
            <video autoPlay loop muted playsInline>
              <source src={game3Video} type="video/webm" />
            </video>
          </div>

          <form className="answer-form" onSubmit={handleAnswer3Submit}>
            <input
              type="number"
              className={`answer-input ${error3 ? 'error' : ''}`}
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              placeholder="Введи число"
            />
            {error3 && <p className="error-text">Неправильно, попробуй еще раз!</p>}
            <button type="submit" className="game-start-button">
              Ответить
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Transition 3
  if (step === 'transition3') {
    return (
      <div className="game-container">
        <PraiseTransition text="Невероятно! Ты лучшая! 💖" useFallingHearts />
      </div>
    );
  }

  // Question 4
  if (step === 'question4') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Когда был сделан первый пост в онлике?</h1>
          <p className="game-subtitle">Введи дату в формате ДД.ММ.ГГГГ</p>
          
          <form className="answer-form" onSubmit={handleAnswer4Submit}>
            <input
              type="text"
              className={`answer-input ${error4 ? 'error' : ''}`}
              value={answer4}
              onChange={(e) => setAnswer4(e.target.value)}
              placeholder="14.14.1414"
              maxLength={10}
            />
            {error4 && <p className="error-text">Неправильно, попробуй еще раз!</p>}
            <button type="submit" className="game-start-button">
              Ответить
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Transition 4
  if (step === 'transition4') {
    return (
      <div className="game-container">
        <PraiseTransition text="Ты помнишь все наши моменты! 🥰" useFallingHearts />
      </div>
    );
  }

  // Question 5
  if (step === 'question5') {
    return (
      <div className="game-container">
        <div className="game-welcome">
          <h1 className="game-title">Ксюшенька моя самая любимая???</h1>
          
          <div className="video-container">
            <video autoPlay loop muted playsInline>
              <source src={game4Video} type="video/webm" />
            </video>
          </div>

          <div className="buttons-container">
            <button className="game-yes-button" onClick={handleYes2}>
              Дя
            </button>
            <button 
              className={`game-no-button ${isNo2ButtonInitialized ? 'floating' : ''}`}
              style={
                isNo2ButtonInitialized 
                  ? { top: `${no2ButtonPos.top}%`, left: `${no2ButtonPos.left}%` }
                  : {}
              }
              onMouseEnter={handleNo2Hover}
              onTouchStart={handleNo2Hover}
            >
              Неть
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transition 5
  if (step === 'transition5') {
    return (
      <div className="game-container">
        <PraiseTransition text="Ты моя самая любимая! 💕" useFallingHearts />
      </div>
    );
  }

  // Certificates
  if (step === 'certificates') {
    return (
      <div className="game-container">
        <div className="game-welcome certificates-screen">
          <h1 className="game-title">Ты умничка! Все прошла, все знаешь! 🎉</h1>
          <p className="game-subtitle">Я дарю тебе 3 сертификата</p>
          
          <div className="certificate-viewer">
            <button className="arrow-button left" onClick={handlePrevCertificate}>
              ←
            </button>
            
            <div className="certificate-container">
              <img 
                src={certificates[currentCertificate].image} 
                alt={certificates[currentCertificate].name}
                className="certificate-image"
              />
              <p className="certificate-name">{certificates[currentCertificate].name}</p>
            </div>
            
            <button className="arrow-button right" onClick={handleNextCertificate}>
              →
            </button>
          </div>

          <button className="game-start-button" onClick={handleDownloadCertificate}>
            Скачать сертификат
          </button>
        </div>
      </div>
    );
  }

  // Next step
  return (
    <div className="game-container">
      <div className="game-welcome">
        <h1 className="game-title">Следующий этап...</h1>
      </div>
    </div>
  );
}

export default Game;
