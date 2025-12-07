import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestStep from './QuestStep';

describe('QuestStep', () => {
  const mockProps = {
    stepNumber: 1,
    title: 'Первое задание',
    description: 'Найди место, где мы впервые встретились.',
    onCodeSubmit: vi.fn(),
    isValidating: false,
    difficulty: 1
  };

  it('should render step number and title', () => {
    render(<QuestStep {...mockProps} />);

    expect(screen.getByText('Этап 1 из 11')).toBeInTheDocument();
    expect(screen.getByText('Первое задание')).toBeInTheDocument();
  });

  it('should render step description', () => {
    render(<QuestStep {...mockProps} />);

    expect(screen.getByText(/Найди место, где мы впервые встретились/i)).toBeInTheDocument();
  });

  it('should render code input field', () => {
    render(<QuestStep {...mockProps} />);

    expect(screen.getByPlaceholderText(/введи код/i)).toBeInTheDocument();
  });

  it('should call onCodeSubmit when valid code is entered', async () => {
    const user = userEvent.setup();
    const onCodeSubmit = vi.fn().mockResolvedValue(true);
    
    render(<QuestStep {...mockProps} onCodeSubmit={onCodeSubmit} />);

    const input = screen.getByPlaceholderText(/введи код/i);
    const button = screen.getByRole('button', { name: /проверить/i });

    await user.type(input, 'TEST123');
    await user.click(button);

    expect(onCodeSubmit).toHaveBeenCalledWith('TEST123');
  });

  it('should show loading state when validating', () => {
    render(<QuestStep {...mockProps} isValidating={true} />);

    expect(screen.getByText(/проверяю код/i)).toBeInTheDocument();
  });

  it('should display different step numbers correctly', () => {
    const { rerender } = render(<QuestStep {...mockProps} stepNumber={3} />);
    expect(screen.getByText('Этап 3 из 5')).toBeInTheDocument();

    rerender(<QuestStep {...mockProps} stepNumber={5} />);
    expect(screen.getByText('Этап 5 из 5')).toBeInTheDocument();
  });
});
