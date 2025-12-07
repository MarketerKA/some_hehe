import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QuestProvider } from './context/QuestContext';
import App from './App';
import './styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuestProvider>
      <App />
    </QuestProvider>
  </StrictMode>
);
