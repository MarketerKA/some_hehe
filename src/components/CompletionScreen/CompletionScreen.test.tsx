import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionScreen from './CompletionScreen';

describe('CompletionScreen', () => {
  it('should render completion message', () => {
    render(<CompletionScreen />);

    expect(screen.getByText(/Поздравляю! Ты прошла все испытания!/i)).toBeInTheDocument();
  });

  it('should render congratulations text', () => {
    render(<CompletionScreen />);

    expect(screen.getByText(/прошла все 5 этапов/i)).toBeInTheDocument();
  });

  it('should render reset button when onReset is provided', () => {
    const onReset = vi.fn();
    render(<CompletionScreen onReset={onReset} />);

    expect(screen.getByRole('button', { name: /начать заново/i })).toBeInTheDocument();
  });

  it('should not render reset button when onReset is not provided', () => {
    render(<CompletionScreen />);

    expect(screen.queryByRole('button', { name: /начать заново/i })).not.toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<CompletionScreen onReset={onReset} />);

    const button = screen.getByRole('button', { name: /начать заново/i });
    await user.click(button);

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should render celebration hearts', () => {
    const { container } = render(<CompletionScreen />);
    
    const hearts = container.querySelectorAll('.heart');
    expect(hearts.length).toBe(3);
  });
});
