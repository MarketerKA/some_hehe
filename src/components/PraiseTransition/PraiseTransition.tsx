import HeartsAnimation from '../HeartsAnimation/HeartsAnimation';
import FallingHearts from '../FallingHearts/FallingHearts';
import './PraiseTransition.scss';

interface PraiseTransitionProps {
  text: string;
  heartsPos?: { x: number; y: number } | null;
  useFallingHearts?: boolean;
}

const PraiseTransition = ({ text, heartsPos, useFallingHearts = false }: PraiseTransitionProps) => {
  return (
    <div className="praise-container">
      <div className="praise-content">
        <h1 className="praise-text">{text}</h1>
      </div>
      {useFallingHearts ? (
        <FallingHearts />
      ) : (
        heartsPos && <HeartsAnimation triggerX={heartsPos.x} triggerY={heartsPos.y} />
      )}
    </div>
  );
};

export default PraiseTransition;
