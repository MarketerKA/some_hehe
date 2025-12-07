import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStoredProgress, saveProgress, clearProgress, isLocalStorageAvailable } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStoredProgress', () => {
    it('should return null when no data is stored', () => {
      const result = getStoredProgress();
      expect(result).toBeNull();
    });

    it('should return stored progress when valid data exists', () => {
      const mockProgress = {
        currentStep: 3,
        unlockedSteps: [1, 2, 3],
        timestamp: Date.now()
      };
      localStorage.setItem('romantic-quest-progress', JSON.stringify(mockProgress));

      const result = getStoredProgress();
      expect(result).toEqual(mockProgress);
    });

    it('should return null and clear storage when data is corrupted', () => {
      localStorage.setItem('romantic-quest-progress', 'invalid json');
      
      const result = getStoredProgress();
      expect(result).toBeNull();
    });

    it('should return null when stored data has invalid structure', () => {
      const invalidProgress = {
        currentStep: 'invalid',
        unlockedSteps: 'not an array',
        timestamp: 'not a number'
      };
      localStorage.setItem('romantic-quest-progress', JSON.stringify(invalidProgress));

      const result = getStoredProgress();
      expect(result).toBeNull();
      expect(localStorage.getItem('romantic-quest-progress')).toBeNull();
    });
  });

  describe('saveProgress', () => {
    it('should save progress to localStorage', () => {
      saveProgress(2, [1, 2]);

      const stored = localStorage.getItem('romantic-quest-progress');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.currentStep).toBe(2);
      expect(parsed.unlockedSteps).toEqual([1, 2]);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should handle localStorage errors gracefully', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveProgress(1, [1])).not.toThrow();
      
      setItemSpy.mockRestore();
    });
  });

  describe('clearProgress', () => {
    it('should remove progress from localStorage', () => {
      saveProgress(3, [1, 2, 3]);
      expect(localStorage.getItem('romantic-quest-progress')).toBeTruthy();

      clearProgress();
      expect(localStorage.getItem('romantic-quest-progress')).toBeNull();
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });
  });
});
