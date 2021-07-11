import React, { FC } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LobbiPage from './pages/lobbiPage';
import GamePage from './pages/GamePage';

const App: FC = () => (
  <BrowserRouter>
    <Route path={'/'} exact>
      <LobbiPage />
    </Route>
    <Route path={'/game'} exact>
      <GamePage />
    </Route>
  </BrowserRouter>
);

export default App;
