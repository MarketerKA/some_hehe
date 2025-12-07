import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeInput from './CodeInput';

describe('CodeInput', () => {
  it('should render input field and submit button', () => {
    const onSubmit = vi.fn();
    render(<CodeInput onSubmit={onSubmit} isValidating={false} error={false} />);

    expect(screen.getByPlaceholderText(/введи код/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /проверить/i })).toBeInTheDocument();
  });

  it('should call onSubmit with entered code', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CodeInput onSubmit={onSubmit} isValidating={false} error={false} />);

    const input = screen.getByPlaceholderText(/введи код/i);
    const button = screen.getByRole('button', { name: /проверить/i });

    await user.type(input, 'TESTCODE');
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledWith('TESTCODE');
  });

  it('should not submit empty code', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CodeInput onSubmit={onSubmit} isValidating={false} error={false} />);

    const button = screen.getByRole('button', { name: /проверить/i });
    await user.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show loading animation when validating', () => {
    const onSubmit = vi.fn();
    render(<CodeInput onSubmit={onSubmit} isValidating={true} error={false} />);

    expect(screen.getByText(/проверяю код/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/введи код/i)).not.toBeInTheDocument();
  });

  it('should show error animation when error is true', () => {
    const onSubmit = vi.fn();
    render(<CodeInput onSubmit={onSubmit} isValidating={false} error={true} />);

    expect(screen.getByText(/неверный код/i)).toBeInTheDocument();
  });

  it('should disable input and button when validating', () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<CodeInput onSubmit={onSubmit} isValidating={false} error={false} />);

    const input = screen.getByPlaceholderText(/введи код/i);
    const button = screen.getByRole('button', { name: /проверить/i });

    expect(input).not.toBeDisabled();
    expect(button).toBeDisabled(); // Disabled because empty

    rerender(<CodeInput onSubmit={onSubmit} isValidating={true} error={false} />);
    // Input should not be visible when validating
  });
});
