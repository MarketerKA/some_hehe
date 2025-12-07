export interface QuestStep {
  id: number;
  title: string;
  description: string;
  accessCode: string;
  difficulty: number; // 1-5, where 1 is easy and 5 is hardest
  image?: string; // Optional image path
}

export interface QuestData {
  welcomeMessage: string;
  completionMessage: string;
  steps: QuestStep[];
}

export interface QuestState {
  currentStep: number; // 0 = welcome, 1-11 = steps, 12 = completion
  unlockedSteps: number[];
  isValidating: boolean;
}

export interface QuestContextType {
  state: QuestState;
  startQuest: () => void;
  validateCode: (code: string) => Promise<boolean>;
  goToStep: (step: number) => void;
  resetQuest: () => void;
}

export interface StoredProgress {
  currentStep: number;
  unlockedSteps: number[];
  timestamp: number;
}
