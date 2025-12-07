import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { QuestState, QuestContextType } from '../types/quest.types';
import { questData } from '../data/questData';
import { getStoredProgress, saveProgress, clearProgress } from '../hooks/useLocalStorage';

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within QuestProvider');
  }
  return context;
};

interface QuestProviderProps {
  children: ReactNode;
}

export const QuestProvider = ({ children }: QuestProviderProps) => {
  const [state, setState] = useState<QuestState>(() => {
    // Initialize from localStorage if available
    const stored = getStoredProgress();
    if (stored) {
      return {
        currentStep: stored.currentStep,
        unlockedSteps: stored.unlockedSteps,
        isValidating: false
      };
    }
    return {
      currentStep: 0, // Start at welcome screen
      unlockedSteps: [],
      isValidating: false
    };
  });

  // Save progress whenever state changes
  useEffect(() => {
    if (state.currentStep > 0) {
      saveProgress(state.currentStep, state.unlockedSteps);
    }
  }, [state.currentStep, state.unlockedSteps]);

  const startQuest = () => {
    setState(prev => ({
      ...prev,
      currentStep: 1,
      unlockedSteps: [1]
    }));
  };

  const validateCode = async (code: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isValidating: true }));

    // Simulate async validation with delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const currentStepData = questData.steps[state.currentStep - 1];
    
    // First step (test) and last step (bonus) accept any code
    const isValid = (state.currentStep === 1 || state.currentStep === 11)
      ? code.trim().length > 0 
      : code.trim().toUpperCase() === currentStepData.accessCode.toUpperCase();

    setState(prev => ({ ...prev, isValidating: false }));

    if (isValid) {
      // Move to next step
      const nextStep = state.currentStep + 1;
      const isLastStep = state.currentStep === questData.steps.length;

      setState(prev => ({
        ...prev,
        currentStep: isLastStep ? 12 : nextStep, // 12 = completion screen
        unlockedSteps: isLastStep ? prev.unlockedSteps : [...prev.unlockedSteps, nextStep]
      }));
    }

    return isValid;
  };

  const goToStep = (step: number) => {
    // Only allow navigation to unlocked steps
    if (step === 0 || state.unlockedSteps.includes(step) || step === 12) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  };

  const resetQuest = () => {
    clearProgress();
    setState({
      currentStep: 0,
      unlockedSteps: [],
      isValidating: false
    });
  };

  const value: QuestContextType = {
    state,
    startQuest,
    validateCode,
    goToStep,
    resetQuest
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
};
