import { useQuest } from './context/QuestContext';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import QuestStep from './components/QuestStep/QuestStep';
import CompletionScreen from './components/CompletionScreen/CompletionScreen';
import { questData } from './data/questData';
import './App.scss';

function App() {
  const { state, startQuest, validateCode, resetQuest } = useQuest();

  // Welcome screen
  if (state.currentStep === 0) {
    return <WelcomeScreen onStart={startQuest} />;
  }

  // Completion screen
  if (state.currentStep === 12) {
    return <CompletionScreen onReset={resetQuest} />;
  }

  // Quest steps (1-5)
  // Validate access to current step
  if (!state.unlockedSteps.includes(state.currentStep)) {
    // Redirect to the last unlocked step or welcome screen
    const lastUnlockedStep = state.unlockedSteps.length > 0 
      ? Math.max(...state.unlockedSteps) 
      : 0;
    
    if (lastUnlockedStep === 0) {
      return <WelcomeScreen onStart={startQuest} />;
    }
    
    const redirectStepData = questData.steps[lastUnlockedStep - 1];
    return (
      <div className="app">
        <QuestStep
          stepNumber={redirectStepData.id}
          title={redirectStepData.title}
          description={redirectStepData.description}
          onCodeSubmit={validateCode}
          isValidating={state.isValidating}
          difficulty={redirectStepData.difficulty}
          image={redirectStepData.image}
        />
      </div>
    );
  }

  const currentStepData = questData.steps[state.currentStep - 1];

  return (
    <div className="app">
      <QuestStep
        stepNumber={currentStepData.id}
        title={currentStepData.title}
        description={currentStepData.description}
        onCodeSubmit={validateCode}
        isValidating={state.isValidating}
        difficulty={currentStepData.difficulty}
        image={currentStepData.image}
      />
    </div>
  );
}

export default App;
