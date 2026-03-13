import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import FallingHearts from '../components/FallingHearts/FallingHearts';
import { birthdayQuestContent } from '../data/birthdayQuestContent';
import { usePreloadImages } from '../hooks/usePreloadImages';
import puzzlePhoto from '../assets/pazzle.png';
import certificateImage from '../assets/serteficateavto.png';
import './BirthdayQuest.scss';

type StepNumber = 1 | 2 | 3 | 4 | 5;

interface StepShellProps {
  accent: string;
  title: string;
  description: string;
  progressLabel: string;
  children: ReactNode;
}

interface PuzzleTileStyle extends CSSProperties {
  '--bg-x': string;
  '--bg-y': string;
}

interface Obstacle {
  id: number;
  x: number;
  gapTop: number;
  passed: boolean;
}

interface AngelGameState {
  angelY: number;
  velocity: number;
  score: number;
  status: 'ready' | 'running' | 'lost' | 'won';
  obstacles: Obstacle[];
  generatedCount: number;
}

interface StoredBirthdayQuestProgress {
  currentStep: number;
  updatedAt: number;
}

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Умная', 'Пазл', 'Ангелочек', 'Подарок', 'Созвездие'];
export const BIRTHDAY_QUEST_STORAGE_KEY = 'birthday-quest-progress-v1';
const MEMORY_PATTERNS = [
  [0, 2],
  [3, 1, 2],
  [1, 3, 0, 2],
];
const PUZZLE_GRID_SIZE = 3;
const ANGEL_GAME = {
  width: 320,
  height: 420,
  angelX: 68,
  angelSize: 52,
  gravity: 0.11,
  jump: -2.95,
  maxFallSpeed: 2.6,
  speed: 0.95,
  gapHeight: 238,
  obstacleWidth: 54,
  obstacleSpacing: 216,
  collisionInsetX: 10,
  collisionInsetY: 12,
  targetScore: 3,
};
const GIFT_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
];
const CONSTELLATION_STARS = [
  { id: 1, left: 12, top: 40 },
  { id: 2, left: 32, top: 20 },
  { id: 3, left: 52, top: 34 },
  { id: 4, left: 66, top: 16 },
  { id: 5, left: 78, top: 46 },
  { id: 6, left: 46, top: 68 },
];

const createShuffledTiles = (): number[] => {
  const base = Array.from({ length: PUZZLE_GRID_SIZE * PUZZLE_GRID_SIZE }, (_, index) => index);
  let shuffled = [...base];

  do {
    shuffled = [...base];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
  } while (shuffled.every((tile, index) => tile === index));

  return shuffled;
};

const createObstacle = (index: number, x: number): Obstacle => ({
  id: index,
  x,
  gapTop: 88 + ((index * 47) % 92),
  passed: false,
});

const createInitialAngelState = (): AngelGameState => ({
  angelY: ANGEL_GAME.height / 2 - ANGEL_GAME.angelSize / 2,
  velocity: 0,
  score: 0,
  status: 'ready',
  generatedCount: 3,
  obstacles: [
    createObstacle(0, ANGEL_GAME.width + 70),
    createObstacle(1, ANGEL_GAME.width + 70 + ANGEL_GAME.obstacleSpacing),
    createObstacle(2, ANGEL_GAME.width + 70 + ANGEL_GAME.obstacleSpacing * 2),
  ],
});

const readBirthdayQuestProgress = (): number => {
  try {
    const stored = localStorage.getItem(BIRTHDAY_QUEST_STORAGE_KEY);
    if (!stored) {
      return 0;
    }

    const parsed = JSON.parse(stored) as StoredBirthdayQuestProgress;
    if (
      typeof parsed.currentStep !== 'number' ||
      parsed.currentStep < 0 ||
      parsed.currentStep > TOTAL_STEPS + 1
    ) {
      localStorage.removeItem(BIRTHDAY_QUEST_STORAGE_KEY);
      return 0;
    }

    return parsed.currentStep;
  } catch {
    return 0;
  }
};

const saveBirthdayQuestProgress = (currentStep: number) => {
  try {
    const payload: StoredBirthdayQuestProgress = {
      currentStep,
      updatedAt: Date.now(),
    };
    localStorage.setItem(BIRTHDAY_QUEST_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors and keep the quest playable.
  }
};

const StepShell = ({ accent, title, description, progressLabel, children }: StepShellProps) => (
  <section className="birthday-step-card">
    <div className="birthday-step-card__header">
      <span className="birthday-step-card__accent">{accent}</span>
      <span className="birthday-step-card__progress">{progressLabel}</span>
    </div>
    <h2>{title}</h2>
    <p>{description}</p>
    <div className="birthday-step-card__body">{children}</div>
  </section>
);

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="birthday-progress">
    <div className="birthday-progress__topline">
      <span>Шаг {currentStep} из {TOTAL_STEPS}</span>
      <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
    </div>
    <div className="birthday-progress__track">
      <div
        className="birthday-progress__fill"
        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
      />
    </div>
    <div className="birthday-progress__labels">
      {STEP_LABELS.map((label, index) => (
        <span
          key={label}
          className={index < currentStep ? 'is-active' : ''}
        >
          {label}
        </span>
      ))}
    </div>
  </div>
);

const PraiseSlide = ({ text }: { text: string }) => (
  <div className="birthday-praise">
    <FallingHearts />
    <div className="birthday-praise__flash birthday-praise__flash--one" />
    <div className="birthday-praise__flash birthday-praise__flash--two" />
    <div className="birthday-praise__card">
      <div className="birthday-praise__sparkles" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="birthday-praise__eyebrow">Еще шаг ближе к подарку 💝</span>
      <h2>{text}</h2>
    </div>
  </div>
);

const SmartCandlesGame = ({ onComplete }: { onComplete: () => void }) => {
  const [round, setRound] = useState(0);
  const [input, setInput] = useState<number[]>([]);
  const [activeCandle, setActiveCandle] = useState<number | null>(null);
  const [phase, setPhase] = useState<'showing' | 'input' | 'locked' | 'won'>('showing');
  const [helperText, setHelperText] = useState('Смотри внимательно: свечки сейчас покажут последовательность.');
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const timers: number[] = [];
    const pattern = MEMORY_PATTERNS[round];

    pattern.forEach((candleIndex, index) => {
      timers.push(
        window.setTimeout(() => {
          if (isCancelled) {
            return;
          }
          setActiveCandle(candleIndex);
        }, 650 * index + 300),
      );

      timers.push(
        window.setTimeout(() => {
          if (isCancelled) {
            return;
          }
          setActiveCandle(null);
        }, 650 * index + 720),
      );
    });

    timers.push(
      window.setTimeout(() => {
        if (isCancelled) {
          return;
        }
        setPhase('input');
        setHelperText('Теперь твоя очередь. Повтори порядок касаний.');
      }, pattern.length * 650 + 480),
    );

    return () => {
      isCancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [round, replayKey]);

  const restartRound = (nextRound: number, nextText = 'Смотри внимательно: свечки сейчас покажут последовательность.') => {
    setRound(nextRound);
    setInput([]);
    setActiveCandle(null);
    setPhase('showing');
    setHelperText(nextText);
    setReplayKey((value) => value + 1);
  };

  const handleCandleClick = (candleIndex: number) => {
    if (phase !== 'input') {
      return;
    }

    const pattern = MEMORY_PATTERNS[round];
    const nextInput = [...input, candleIndex];

    if (pattern[input.length] !== candleIndex) {
      setPhase('locked');
      setHelperText('Почти. Свечки решили еще раз подсказать тебе последовательность.');
      window.setTimeout(() => {
        restartRound(round);
      }, 950);
      return;
    }

    setInput(nextInput);

    if (nextInput.length === pattern.length) {
      if (round === MEMORY_PATTERNS.length - 1) {
        setPhase('won');
        setHelperText('Безупречно. Самая умная именинница победила.');
        window.setTimeout(onComplete, 900);
        return;
      }

      setPhase('locked');
      setHelperText('Идеально. Добавим еще одну свечку.');
      window.setTimeout(() => {
        restartRound(round + 1);
      }, 850);
    }
  };

  return (
    <div className="birthday-smart-game">
      <div className="birthday-smart-game__status">
        <strong>Раунд {round + 1} / {MEMORY_PATTERNS.length}</strong>
        <span>{helperText}</span>
      </div>

      <div className="birthday-smart-game__grid">
        {['🧁', '🎂', '🕯️', '🍓'].map((icon, index) => (
          <button
            key={icon}
            className={`birthday-smart-game__candle ${activeCandle === index ? 'is-active' : ''} ${input.includes(index) && phase !== 'showing' ? 'is-picked' : ''}`}
            type="button"
            onClick={() => handleCandleClick(index)}
            disabled={phase !== 'input'}
          >
            <span>{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PuzzleGame = ({ onComplete }: { onComplete: () => void }) => {
  const [tiles, setTiles] = useState<number[]>(() => createShuffledTiles());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const handleTileClick = (index: number) => {
    if (isSolved) {
      return;
    }

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const nextTiles = [...tiles];
    [nextTiles[selectedIndex], nextTiles[index]] = [nextTiles[index], nextTiles[selectedIndex]];
    const solved = nextTiles.every((tile, tileIndex) => tile === tileIndex);

    setTiles(nextTiles);
    setSelectedIndex(null);
    setMoves((value) => value + 1);

    if (solved) {
      setIsSolved(true);
      window.setTimeout(onComplete, 900);
    }
  };

  return (
    <div className="birthday-puzzle">
      <div className="birthday-puzzle__meta">
        <span>Ходы: {moves}</span>
        <span>{isSolved ? 'Картинка собрана 💖' : 'Нажми на два фрагмента, чтобы поменять их местами ✨'}</span>
      </div>

      <div className="birthday-puzzle__board">
        {tiles.map((tile, index) => {
          const tileStyle: PuzzleTileStyle = {
            '--bg-x': `${(tile % PUZZLE_GRID_SIZE) * 50}%`,
            '--bg-y': `${Math.floor(tile / PUZZLE_GRID_SIZE) * 50}%`,
            backgroundImage: `url(${puzzlePhoto})`,
          };

          return (
            <button
              key={`${tile}-${index}`}
              className={`birthday-puzzle__tile ${selectedIndex === index ? 'is-selected' : ''} ${isSolved ? 'is-solved' : ''}`}
              type="button"
              style={tileStyle}
              onClick={() => handleTileClick(index)}
            />
          );
        })}
      </div>

      <div className="birthday-puzzle__preview">
        <img src={puzzlePhoto} alt="Фото для пазла" />
        <span>Подсказка: именно такой должна получиться картинка после сборки.</span>
      </div>
    </div>
  );
};

const AngelFlightGame = ({ onComplete }: { onComplete: () => void }) => {
  const [game, setGame] = useState<AngelGameState>(createInitialAngelState);
  const gameRef = useRef(game);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (game.status !== 'running') {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();

    const tick = (currentTime: number) => {
      const delta = Math.min(2, (currentTime - previousTime) / 16.67);
      previousTime = currentTime;

      const currentGame = gameRef.current;
      let nextStatus = currentGame.status;
      let nextVelocity = Math.min(
        ANGEL_GAME.maxFallSpeed,
        currentGame.velocity + ANGEL_GAME.gravity * delta,
      );
      let nextY = currentGame.angelY + nextVelocity * delta;
      let nextScore = currentGame.score;

      const movedObstacles = currentGame.obstacles
        .map((obstacle) => {
          const nextObstacle = {
            ...obstacle,
            x: obstacle.x - ANGEL_GAME.speed * delta,
          };

          if (!nextObstacle.passed && nextObstacle.x + ANGEL_GAME.obstacleWidth < ANGEL_GAME.angelX) {
            nextObstacle.passed = true;
            nextScore += 1;
          }

          return nextObstacle;
        })
        .filter((obstacle) => obstacle.x + ANGEL_GAME.obstacleWidth > -20);

      let generatedCount = currentGame.generatedCount;
      while (movedObstacles.length < 3 && generatedCount < ANGEL_GAME.targetScore + 3) {
        const lastX = movedObstacles[movedObstacles.length - 1]?.x ?? ANGEL_GAME.width + 90;
        movedObstacles.push(createObstacle(generatedCount, lastX + ANGEL_GAME.obstacleSpacing));
        generatedCount += 1;
      }

      const minY = 6;
      const maxY = ANGEL_GAME.height - ANGEL_GAME.angelSize - 6;

      if (nextY < minY) {
        nextY = minY;
        nextVelocity = 0.15;
      } else if (nextY > maxY) {
        nextY = maxY;
        nextVelocity = 0.2;
      }

      const angelTop = nextY + ANGEL_GAME.collisionInsetY;
      const angelBottom = nextY + ANGEL_GAME.angelSize - ANGEL_GAME.collisionInsetY;
      const angelLeft = ANGEL_GAME.angelX + ANGEL_GAME.collisionInsetX;
      const angelRight = ANGEL_GAME.angelX + ANGEL_GAME.angelSize - ANGEL_GAME.collisionInsetX;

      movedObstacles.forEach((obstacle) => {
        const overlapsX =
          angelRight > obstacle.x &&
          angelLeft < obstacle.x + ANGEL_GAME.obstacleWidth;
        const insideGap =
          angelTop > obstacle.gapTop &&
          angelBottom < obstacle.gapTop + ANGEL_GAME.gapHeight;

        if (overlapsX && !insideGap) {
          nextStatus = 'lost';
        }
      });

      if (nextScore >= ANGEL_GAME.targetScore) {
        nextStatus = 'won';
      }

      const nextGame: AngelGameState = {
        angelY: nextY,
        velocity: nextVelocity,
        score: nextScore,
        status: nextStatus,
        obstacles: movedObstacles,
        generatedCount,
      };

      gameRef.current = nextGame;
      setGame(nextGame);

      if (nextGame.status === 'running') {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [game.status]);

  useEffect(() => {
    if (game.status !== 'won') {
      return;
    }

    const timer = window.setTimeout(onComplete, 1000);
    return () => window.clearTimeout(timer);
  }, [game.status, onComplete]);

  const flap = () => {
    setGame((currentGame) => {
      if (currentGame.status === 'ready') {
        return {
          ...createInitialAngelState(),
          status: 'running',
          velocity: ANGEL_GAME.jump,
        };
      }

      if (currentGame.status !== 'running') {
        return currentGame;
      }

      return {
        ...currentGame,
        velocity: ANGEL_GAME.jump,
      };
    });
  };

  const restart = () => {
    setGame(createInitialAngelState());
  };

  return (
    <div className="birthday-angel">
      <div
        className="birthday-angel__arena"
        aria-label="Игровое поле девочки"
        onClick={flap}
      >
        <div className="birthday-angel__sky" />
        <div className="birthday-angel__moon" />
        <div className="birthday-angel__cloud birthday-angel__cloud--one" />
        <div className="birthday-angel__cloud birthday-angel__cloud--two" />
        <div className="birthday-angel__cloud birthday-angel__cloud--three" />

        {game.obstacles.map((obstacle) => (
          <div key={obstacle.id}>
            <div
              className="birthday-angel__column birthday-angel__column--top"
              style={{
                left: obstacle.x,
                height: obstacle.gapTop,
                width: ANGEL_GAME.obstacleWidth,
              }}
            />
            <div
              className="birthday-angel__column birthday-angel__column--bottom"
              style={{
                left: obstacle.x,
                top: obstacle.gapTop + ANGEL_GAME.gapHeight,
                height: ANGEL_GAME.height - obstacle.gapTop - ANGEL_GAME.gapHeight,
                width: ANGEL_GAME.obstacleWidth,
              }}
            />
          </div>
        ))}

        <div
          className={`birthday-angel__hero ${game.status === 'running' ? 'is-flying' : ''}`}
          style={{
            transform: `translate(${ANGEL_GAME.angelX}px, ${game.angelY}px) rotate(${Math.max(-14, Math.min(18, game.velocity * 7))}deg)`,
          }}
        >
          <span className="birthday-angel__trail" />
          <span className="birthday-angel__girl" aria-hidden="true">👧</span>
          <span className="birthday-angel__sparkle birthday-angel__sparkle--one" aria-hidden="true">✦</span>
          <span className="birthday-angel__sparkle birthday-angel__sparkle--two" aria-hidden="true">✦</span>
        </div>

        <div className="birthday-angel__hud">
          <span>Ворот до победы 💖: {ANGEL_GAME.targetScore}</span>
          <strong>{game.score}</strong>
        </div>

        {game.status === 'ready' && (
          <div className="birthday-angel__overlay" onClick={(event) => event.stopPropagation()}>
            <h3>Касайся экрана и держи высоту 💕</h3>
            <p>Всё сделано мягче ✨ Девочка летит плавно, а ворот теперь совсем немного ☁️</p>
            <button type="button" onClick={flap}>Полетели 💖</button>
          </div>
        )}

        {game.status === 'lost' && (
          <div className="birthday-angel__overlay" onClick={(event) => event.stopPropagation()}>
            <h3>Еще один полет? 💞</h3>
            <p>Теперь игра сильно легче, так что со второй попытки пройти почти невозможно не пройти ✨</p>
            <button type="button" onClick={restart}>Попробовать снова 💓</button>
          </div>
        )}

        {game.status === 'won' && (
          <div className="birthday-angel__overlay is-success" onClick={(event) => event.stopPropagation()}>
            <h3>Идеальный полет 💖</h3>
            <p>Моя девочка справилась красиво 🥰</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GiftHuntGame = ({ onComplete }: { onComplete: () => void }) => {
  const [secretBox] = useState(() => Math.floor(Math.random() * GIFT_POSITIONS.length));
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [hint, setHint] = useState('Нажми на коробочку 🎁 После промаха я прямо покажу направление: левее, правее, выше или ниже ✨');
  const [hintBadge, setHintBadge] = useState('Ищу подарок');
  const [isFound, setIsFound] = useState(false);

  const getDirectionHint = (boxIndex: number) => {
    const target = GIFT_POSITIONS[secretBox];
    const current = GIFT_POSITIONS[boxIndex];
    const horizontal =
      target.x > current.x ? 'right' : target.x < current.x ? 'left' : 'same';
    const vertical =
      target.y > current.y ? 'down' : target.y < current.y ? 'up' : 'same';

    return { horizontal, vertical, current, target };
  };

  const getDirectionalText = (boxIndex: number) => {
    const { horizontal, vertical } = getDirectionHint(boxIndex);

    if (horizontal === 'same' && vertical === 'same') {
      return 'Подарок тут';
    }

    if (horizontal === 'same') {
      return vertical === 'up'
        ? 'Подарок выше ⬆️'
        : 'Подарок ниже ⬇️';
    }

    if (vertical === 'same') {
      return horizontal === 'left'
        ? 'Подарок левее ⬅️'
        : 'Подарок правее ➡️';
    }

    if (horizontal === 'left' && vertical === 'up') {
      return 'Подарок левее и выше ↖️';
    }

    if (horizontal === 'left' && vertical === 'down') {
      return 'Подарок левее и ниже ↙️';
    }

    if (horizontal === 'right' && vertical === 'up') {
      return 'Подарок правее и выше ↗️';
    }

    return 'Подарок правее и ниже ↘️';
  };

  const getHintTone = (boxIndex: number) => {
    const target = GIFT_POSITIONS[secretBox];
    const current = GIFT_POSITIONS[boxIndex];
    const distance = Math.abs(target.x - current.x) + Math.abs(target.y - current.y);

    if (distance === 1) {
      return 'Очень горячо 🔥';
    }

    if (distance === 2) {
      return 'Тепло 💖';
    }

    return 'Холодно ❄️';
  };

  const getPrimaryHintAxis = (boxIndex: number) => {
    const target = GIFT_POSITIONS[secretBox];
    const current = GIFT_POSITIONS[boxIndex];
    const horizontalDistance = Math.abs(target.x - current.x);
    const verticalDistance = Math.abs(target.y - current.y);

    if (horizontalDistance === 0) {
      return 'vertical';
    }

    if (verticalDistance === 0) {
      return 'horizontal';
    }

    return horizontalDistance >= verticalDistance ? 'horizontal' : 'vertical';
  };

  const getBoxHintClass = (boxIndex: number) => {
    if (isFound || checkedBoxes.includes(boxIndex) || checkedBoxes.length === 0) {
      return '';
    }

    const lastChecked = checkedBoxes[checkedBoxes.length - 1];
    const { horizontal, vertical } = getDirectionHint(lastChecked);
    const candidate = GIFT_POSITIONS[boxIndex];
    const current = GIFT_POSITIONS[lastChecked];
    const shouldNarrowWithBothAxes = checkedBoxes.length > 1;
    const primaryAxis = getPrimaryHintAxis(lastChecked);

    const matchesHorizontal =
      (!shouldNarrowWithBothAxes && primaryAxis === 'vertical') ||
      horizontal === 'same' ||
      (horizontal === 'left' && candidate.x < current.x) ||
      (horizontal === 'right' && candidate.x > current.x);
    const matchesVertical =
      (!shouldNarrowWithBothAxes && primaryAxis === 'horizontal') ||
      vertical === 'same' ||
      (vertical === 'up' && candidate.y < current.y) ||
      (vertical === 'down' && candidate.y > current.y);

    if (matchesHorizontal && matchesVertical) {
      return 'is-hinted';
    }

    return 'is-muted';
  };

  const handleBoxClick = (boxIndex: number) => {
    if (isFound || checkedBoxes.includes(boxIndex)) {
      return;
    }

    if (boxIndex === secretBox) {
      setCheckedBoxes((value) => [...value, boxIndex]);
      setHintBadge('Нашла 🎉');
      setHint('Нашла 💖 Вот он, кусочек твоего подарочка 🎁');
      setIsFound(true);
      window.setTimeout(onComplete, 1000);
      return;
    }

    setCheckedBoxes((value) => [...value, boxIndex]);
    setHintBadge(getHintTone(boxIndex));
    setHint(
      checkedBoxes.length === 0
        ? `${getDirectionalText(boxIndex)} Сначала подсвечу только часть поля, а если нужно, потом сузим поиск еще сильнее ✨`
        : `${getDirectionalText(boxIndex)} Теперь подсветка стала точнее и ведет тебя дальше ✨`,
    );
  };

  return (
    <div className="birthday-gift">
      <div className={`birthday-gift__hint ${isFound ? 'is-found' : ''}`}>
        <strong className="birthday-gift__hint-badge">{hintBadge}</strong>
        <span>{hint}</span>
      </div>
      <div className="birthday-gift__grid">
        {GIFT_POSITIONS.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`birthday-gift__box ${checkedBoxes.includes(index) ? 'is-opened' : ''} ${isFound && index === secretBox ? 'is-winning' : ''} ${getBoxHintClass(index)}`}
            onClick={() => handleBoxClick(index)}
          >
            <span className="birthday-gift__lid" />
            <span className="birthday-gift__body">🎁</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const WishConstellationGame = ({ onComplete }: { onComplete: () => void }) => {
  const [nextStar, setNextStar] = useState(0);
  const [mistakeStar, setMistakeStar] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const activeStars = CONSTELLATION_STARS.slice(0, nextStar);

  const handleStarClick = (index: number) => {
    if (isComplete) {
      return;
    }

    if (index !== nextStar) {
      setMistakeStar(index);
      window.setTimeout(() => setMistakeStar(null), 500);
      return;
    }

    const nextValue = nextStar + 1;
    setNextStar(nextValue);

    if (nextValue === CONSTELLATION_STARS.length) {
      setIsComplete(true);
      window.setTimeout(onComplete, 1100);
    }
  };

  return (
    <div className="birthday-constellation">
      <div className="birthday-constellation__sky">
        <svg className="birthday-constellation__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {activeStars.slice(0, -1).map((star, index) => {
            const nextPoint = activeStars[index + 1];
            return (
              <line
                key={`${star.id}-${nextPoint.id}`}
                x1={star.left}
                y1={star.top}
                x2={nextPoint.left}
                y2={nextPoint.top}
              />
            );
          })}
        </svg>

        {CONSTELLATION_STARS.map((star, index) => (
          <button
            key={star.id}
            type="button"
            className={`birthday-constellation__star ${index < nextStar ? 'is-linked' : ''} ${mistakeStar === index ? 'is-mistake' : ''}`}
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
            onClick={() => handleStarClick(index)}
          >
            <span>{star.id}</span>
          </button>
        ))}

        {isComplete && <div className="birthday-constellation__message">С днем рождения, Ксюша</div>}
      </div>
      <p className="birthday-constellation__hint">
        Нажимай на звезды по порядку: {Math.min(nextStar + 1, CONSTELLATION_STARS.length)} из {CONSTELLATION_STARS.length}
      </p>
    </div>
  );
};

const FinalScreen = ({ onRestart }: { onRestart: () => void }) => (
  <div className="birthday-final">
    <FallingHearts />
    <div className="birthday-final__content">
      <span className="birthday-final__eyebrow">Финал квеста</span>
      <h1>{birthdayQuestContent.final.title}</h1>
      <p>{birthdayQuestContent.final.message}</p>

      <div className="birthday-final__certificate">
        <span className="birthday-final__certificate-label">С любовью для Ксюши</span>
        <h2>{birthdayQuestContent.final.certificateTitle}</h2>
        <p>{birthdayQuestContent.final.certificateText}</p>
        <img
          className="birthday-final__certificate-image"
          src={certificateImage}
          alt="Сертификат на подарочек"
        />
        <strong>Статус: активирован после прохождения всех заданий</strong>
      </div>

      <div className="birthday-final__actions">
        <a
          className="birthday-final__action birthday-final__action--download"
          href={certificateImage}
          download="serteficateavto.png"
        >
          Скачать сертификат
        </a>
        <button type="button" className="birthday-final__action birthday-final__action--restart" onClick={onRestart}>
          {birthdayQuestContent.final.buttonText}
        </button>
      </div>
    </div>
  </div>
);

function BirthdayQuest() {
  const [currentStep, setCurrentStep] = useState(() => readBirthdayQuestProgress());
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const { loaded } = usePreloadImages([puzzlePhoto, certificateImage]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentStep, praiseText]);

  useEffect(() => {
    saveBirthdayQuestProgress(currentStep);
  }, [currentStep]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const goToNextStep = (step: StepNumber) => {
    const praise = birthdayQuestContent.steps[step - 1].praise;
    setPraiseText(praise);

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setPraiseText(null);
      setCurrentStep(step === TOTAL_STEPS ? TOTAL_STEPS + 1 : step + 1);
    }, 2100);
  };

  const restartQuest = () => {
    setPraiseText(null);
    setCurrentStep(0);
  };

  const renderStep = () => {
    if (currentStep < 1 || currentStep > TOTAL_STEPS) {
      return null;
    }

    const stepContent = birthdayQuestContent.steps[currentStep - 1];
    const progressLabel = `Задание ${currentStep} / ${TOTAL_STEPS}`;

    switch (currentStep) {
      case 1:
        return (
          <StepShell
            key="step-1"
            accent={stepContent.accent}
            title={stepContent.title}
            description={stepContent.description}
            progressLabel={progressLabel}
          >
            <SmartCandlesGame onComplete={() => goToNextStep(1)} />
          </StepShell>
        );
      case 2:
        return (
          <StepShell
            key="step-2"
            accent={stepContent.accent}
            title={stepContent.title}
            description={stepContent.description}
            progressLabel={progressLabel}
          >
            <PuzzleGame onComplete={() => goToNextStep(2)} />
          </StepShell>
        );
      case 3:
        return (
          <StepShell
            key="step-3"
            accent={stepContent.accent}
            title={stepContent.title}
            description={stepContent.description}
            progressLabel={progressLabel}
          >
            <AngelFlightGame onComplete={() => goToNextStep(3)} />
          </StepShell>
        );
      case 4:
        return (
          <StepShell
            key="step-4"
            accent={stepContent.accent}
            title={stepContent.title}
            description={stepContent.description}
            progressLabel={progressLabel}
          >
            <GiftHuntGame onComplete={() => goToNextStep(4)} />
          </StepShell>
        );
      case 5:
        return (
          <StepShell
            key="step-5"
            accent={stepContent.accent}
            title={stepContent.title}
            description={stepContent.description}
            progressLabel={progressLabel}
          >
            <WishConstellationGame onComplete={() => goToNextStep(5)} />
          </StepShell>
        );
      default:
        return null;
    }
  };

  if (!loaded) {
    return (
      <div className="birthday-page birthday-page--centered">
        <div className="birthday-loading">
          <div className="birthday-loading__orb" />
          <p>Собираю праздничную магию...</p>
        </div>
      </div>
    );
  }

  if (praiseText) {
    return <PraiseSlide text={praiseText} />;
  }

  if (currentStep === TOTAL_STEPS + 1) {
    return <FinalScreen onRestart={restartQuest} />;
  }

  if (currentStep === 0) {
    return (
      <div className="birthday-page birthday-page--centered">
        <div className="birthday-background birthday-background--glow-one" />
        <div className="birthday-background birthday-background--glow-two" />
        <div className="birthday-intro">
          <span className="birthday-intro__eyebrow">Birthday Quest</span>
          <h1>{birthdayQuestContent.intro.title}</h1>
          <p>{birthdayQuestContent.intro.description}</p>
          <button type="button" onClick={() => setCurrentStep(1)}>
            {birthdayQuestContent.intro.buttonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="birthday-page">
      <div className="birthday-background birthday-background--glow-one" />
      <div className="birthday-background birthday-background--glow-two" />
      <main className="birthday-layout">
        <ProgressBar currentStep={currentStep} />
        {renderStep()}
      </main>
    </div>
  );
}

export default BirthdayQuest;
