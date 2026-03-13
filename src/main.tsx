import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QuestProvider } from './context/QuestContext';
import App from './App';
import './styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/some_hehe">
      <QuestProvider>
        <App />
      </QuestProvider>
    </BrowserRouter>
  </StrictMode>
);
