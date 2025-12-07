import './ErrorAnimation.scss';

const ErrorAnimation = () => {
  return (
    <div className="error-animation">
      <div className="error-icon">✕</div>
      <p className="error-text">Неверный код, попробуй еще раз</p>
    </div>
  );
};

export default ErrorAnimation;
