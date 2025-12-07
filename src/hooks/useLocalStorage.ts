import type { StoredProgress } from '../types/quest.types';

const STORAGE_KEY = 'romantic-quest-progress';

export const getStoredProgress = (): StoredProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const progress: StoredProgress = JSON.parse(stored);
    
    // Validate stored data structure
    if (
      typeof progress.currentStep !== 'number' ||
      !Array.isArray(progress.unlockedSteps) ||
      typeof progress.timestamp !== 'number'
    ) {
      console.warn('Corrupted localStorage data, resetting progress');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return progress;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const saveProgress = (currentStep: number, unlockedSteps: number[]): void => {
  try {
    const progress: StoredProgress = {
      currentStep,
      unlockedSteps,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // If localStorage is unavailable, continue without persistence
  }
};

export const clearProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
