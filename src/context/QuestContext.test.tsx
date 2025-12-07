import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QuestProvider, useQuest } from './QuestContext';
import * as localStorageUtils from '../hooks/useLocalStorage';

vi.mock('../hooks/useLocalStorage');

describe('QuestContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorageUtils.getStoredProgress).mockReturnValue(null);
    vi.mocked(localStorageUtils.saveProgress).mockImplementation(() => {});
    vi.mocked(localStorageUtils.clearProgress).mockImplementation(() => {});
  });

  it('should initialize with welcome screen state', () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    expect(result.current.state.currentStep).toBe(0);
    expect(result.current.state.unlockedSteps).toEqual([]);
    expect(result.current.state.isValidating).toBe(false);
  });

  it('should load saved progress from localStorage', () => {
    const savedProgress = {
      currentStep: 3,
      unlockedSteps: [1, 2, 3],
      timestamp: Date.now()
    };
    vi.mocked(localStorageUtils.getStoredProgress).mockReturnValue(savedProgress);

    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    expect(result.current.state.currentStep).toBe(3);
    expect(result.current.state.unlockedSteps).toEqual([1, 2, 3]);
  });

  it('should start quest and move to step 1', () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    act(() => {
      result.current.startQuest();
    });

    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.unlockedSteps).toEqual([1]);
  });

  it('should validate correct code and move to next step', async () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    act(() => {
      result.current.startQuest();
    });

    let isValid: boolean = false;
    await act(async () => {
      isValid = await result.current.validateCode('LOVE2024');
    });

    expect(isValid).toBe(true);
    expect(result.current.state.currentStep).toBe(2);
    expect(result.current.state.unlockedSteps).toContain(2);
  });

  it('should reject incorrect code', async () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    act(() => {
      result.current.startQuest();
    });

    let isValid: boolean = true;
    await act(async () => {
      isValid = await result.current.validateCode('WRONG');
    });

    expect(isValid).toBe(false);
    expect(result.current.state.currentStep).toBe(1);
  });

  it('should move to completion screen after last step', async () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    // Start and complete all steps
    act(() => {
      result.current.startQuest();
    });

    const codes = ['LOVE2024', 'PASTA123', 'PARK456', 'COFFEE789', 'FOREVER'];
    
    for (const code of codes) {
      await act(async () => {
        await result.current.validateCode(code);
      });
    }

    expect(result.current.state.currentStep).toBe(6);
  });

  it('should reset quest', () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    act(() => {
      result.current.startQuest();
    });

    act(() => {
      result.current.resetQuest();
    });

    expect(result.current.state.currentStep).toBe(0);
    expect(result.current.state.unlockedSteps).toEqual([]);
    expect(localStorageUtils.clearProgress).toHaveBeenCalled();
  });

  it('should be case insensitive when validating codes', async () => {
    const { result } = renderHook(() => useQuest(), {
      wrapper: QuestProvider
    });

    act(() => {
      result.current.startQuest();
    });

    let isValid: boolean = false;
    await act(async () => {
      isValid = await result.current.validateCode('love2024');
    });

    expect(isValid).toBe(true);
  });
});
