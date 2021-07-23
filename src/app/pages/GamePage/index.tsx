import React, { FC, useState } from 'react';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Players from '../../components/players/players';
import { TeamTypes } from '../../types/piece';
import getInitialBoardState from './chessboard/board';
import Chessboard from './chessboard/Chessboard';
import { getInitialStatePieces } from './chessboard/piece';

const GamePage: FC = () => {
  const storePiecesWithCasteling = getInitialStatePieces();
  const storePiecesWithChecked: JSX.Element[] = [];
  const store = [storePiecesWithCasteling, storePiecesWithChecked];
  const stateOrder = useState<TeamTypes>(TeamTypes.LIGHT);

  return (
        <div>
            <Header isGamePage={true} />
              <Players isGamePage={true} order={stateOrder[0]} />
              <Chessboard
              stateOrder={stateOrder}
              initialBoardState={getInitialBoardState()}
              store={store} />
            <Footer />
        </div>
  );
};

export default GamePage;
