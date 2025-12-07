import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingAnimation from './LoadingAnimation';

describe('LoadingAnimation', () => {
  it('should render loading text', () => {
    render(<LoadingAnimation />);

    expect(screen.getByText(/проверяю код/i)).toBeInTheDocument();
  });

  it('should render spinner element', () => {
    const { container } = render(<LoadingAnimation />);

    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
