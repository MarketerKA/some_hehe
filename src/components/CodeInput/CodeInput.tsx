import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import ErrorAnimation from '../ErrorAnimation/ErrorAnimation';
import './CodeInput.scss';

interface CodeInputProps {
  onSubmit: (code: string) => void;
  isValidating: boolean;
  error: boolean;
  stepNumber?: number;
}

const CodeInput = ({ onSubmit, isValidating, error, stepNumber }: CodeInputProps) => {
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus on mount
    inputRef.current?.focus();
  }, []);

  // Clear input when step changes
  useEffect(() => {
    setCode('');
  }, [stepNumber]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      return;
    }

    onSubmit(code);
  };

  return (
    <div className="code-input-container">
      {isValidating ? (
        <LoadingAnimation />
      ) : showError ? (
        <ErrorAnimation />
      ) : (
        <form onSubmit={handleSubmit} className="code-input-form">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Введи код"
            className="code-input"
            disabled={isValidating}
            autoComplete="off"
          />
          <button
            type="submit"
            className="submit-button"
            disabled={isValidating || !code.trim()}
          >
            Проверить
          </button>
        </form>
      )}
    </div>
  );
};

export default CodeInput;
