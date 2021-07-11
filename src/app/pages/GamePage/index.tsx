import React, { FC } from 'react';

import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import getInitialBoardState from './chessboard/board';
import Chessboard from './chessboard/Chessboard';

const GamePage: FC = () => (
        <div>
            <Header />
            <Chessboard initialBoardState={getInitialBoardState()}/>
            <Footer />
        </div>
);

export default GamePage;
