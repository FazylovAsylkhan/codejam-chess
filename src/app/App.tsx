import React, { FC, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LobbiPage from './pages/lobbiPage';
import GamePage from './pages/GamePage';
import { PlayersNameContext } from './context/app';

const App: FC = () => {
  const [playersName, setPlayersName] = useState<string[]>([]);

  return (
    <PlayersNameContext.Provider value={{ playersName, setPlayersName }}>
    <BrowserRouter>
      <Route path={'/'} exact>
        <LobbiPage />
      </Route>
      <Route path={'/game'} exact>
        <GamePage />
      </Route>
    </BrowserRouter>
    </PlayersNameContext.Provider>
  );
};

export default App;
