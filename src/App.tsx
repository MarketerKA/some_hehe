import { Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Quest from './pages/Quest';
import BirthdayQuest from './pages/BirthdayQuest';
import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/quest" element={<Quest />} />
      <Route path="/game" element={<Game />} />
      <Route path="/birthday" element={<BirthdayQuest />} />
    </Routes>
  );
}

export default App;
