import './LoadingAnimation.scss';

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      <div className="spinner"></div>
      <p className="loading-text">Проверяю код...</p>
    </div>
  );
};

export default LoadingAnimation;
