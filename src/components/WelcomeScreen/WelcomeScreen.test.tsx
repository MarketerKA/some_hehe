import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('should render welcome message', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);

    expect(screen.getByText(/Добро пожаловать в романтический квест/i)).toBeInTheDocument();
  });

  it('should render start button', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);

    expect(screen.getByRole('button', { name: /начать квест/i })).toBeInTheDocument();
  });

  it('should call onStart when button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);

    const button = screen.getByRole('button', { name: /начать квест/i });
    await user.click(button);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should render quest description', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);

    expect(screen.getByText(/5 этапов/i)).toBeInTheDocument();
  });
});
