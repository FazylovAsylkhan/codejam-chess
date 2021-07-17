import React, { FC } from 'react';

import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import getInitialBoardState from './chessboard/board';
import Chessboard from './chessboard/Chessboard';
import { getInitialStatePieces } from './chessboard/piece';

const GamePage: FC = () => {
  const storePiecesWithCasteling = getInitialStatePieces();
  const storePiecesWithChecked: JSX.Element[] = [];
  const store = [storePiecesWithCasteling, storePiecesWithChecked];

  return (
        <div>
            <Header />
            <Chessboard
            initialBoardState={getInitialBoardState()}
            store={store} />
            <Footer />
        </div>
  );
};

export default GamePage;
