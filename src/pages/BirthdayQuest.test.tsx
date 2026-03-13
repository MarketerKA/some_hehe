import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BirthdayQuest, { BIRTHDAY_QUEST_STORAGE_KEY } from './BirthdayQuest';

vi.mock('../hooks/usePreloadImages', () => ({
  usePreloadImages: () => ({ loaded: true }),
}));

describe('BirthdayQuest localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves progress after starting the quest', async () => {
    const user = userEvent.setup();

    render(<BirthdayQuest />);
    await user.click(screen.getByRole('button', { name: /Начать праздник/i }));

    await waitFor(() => {
      const storedRaw = window.localStorage.getItem(BIRTHDAY_QUEST_STORAGE_KEY);
      expect(storedRaw).not.toBeNull();
      expect(JSON.parse(storedRaw!)).toMatchObject({ currentStep: 1 });
    });
  });

  it('restores the saved step on reload', () => {
    window.localStorage.setItem(
      BIRTHDAY_QUEST_STORAGE_KEY,
      JSON.stringify({ currentStep: 3, updatedAt: Date.now() }),
    );

    render(<BirthdayQuest />);

    expect(screen.getByText(/Полет девочки/i)).toBeInTheDocument();
    expect(screen.getByText(/Задание 3 \/ 5/i)).toBeInTheDocument();
  });
});
