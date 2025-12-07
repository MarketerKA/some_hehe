import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SuccessAnimation from './SuccessAnimation';

describe('SuccessAnimation', () => {
  it('should render success text', () => {
    render(<SuccessAnimation />);

    expect(screen.getByText(/верно/i)).toBeInTheDocument();
  });

  it('should render checkmark SVG', () => {
    const { container } = render(<SuccessAnimation />);

    const svg = container.querySelector('.checkmark');
    expect(svg).toBeInTheDocument();
  });

  it('should call onComplete after animation', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    
    render(<SuccessAnimation onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    vi.useRealTimers();
  });

  it('should not call onComplete if not provided', () => {
    render(<SuccessAnimation />);
    // Should not throw error
  });
});
