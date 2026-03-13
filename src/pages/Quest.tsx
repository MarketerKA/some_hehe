import { useQuest } from '../context/QuestContext';
import WelcomeScreen from '../components/WelcomeScreen/WelcomeScreen';
import QuestStep from '../components/QuestStep/QuestStep';
import CompletionScreen from '../components/CompletionScreen/CompletionScreen';
import ImagePreloader from '../components/ImagePreloader/ImagePreloader';
import { questData } from '../data/questData';

function Quest() {
  const { state, startQuest, validateCode, resetQuest } = useQuest();
  
  const allImages = questData.steps.map(step => step.image);

  return (
    <ImagePreloader images={allImages}>
      {state.currentStep === 0 && <WelcomeScreen onStart={startQuest} />}
      {state.currentStep === 12 && <CompletionScreen onReset={resetQuest} />}
      {state.currentStep > 0 && state.currentStep < 12 && (() => {
        if (!state.unlockedSteps.includes(state.currentStep)) {
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
      })()}
    </ImagePreloader>
  );
}

export default Quest;
