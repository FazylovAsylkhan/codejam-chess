import React, { FC, useEffect, useRef } from 'react';
import ChessboardService from '../../../service';
import './chessboard.scss';

interface ChessboardProps {
  initialBoardState: JSX.Element[];
  store: Array<JSX.Element[]>;
}

const Chessboard: FC<ChessboardProps> = (props) => {
  const { initialBoardState, store } = props;
  const chessboardRef = useRef<HTMLDivElement>(null);
  const chessboardService = new ChessboardService(chessboardRef, initialBoardState, store);

  useEffect(() => {
    const currentTeam = chessboardService.stateOrder[0];
    const hasCheck = chessboardService.referee.isCheck(currentTeam);
    if (hasCheck) {
      chessboardService.showCheck();
    }
  }, [chessboardService.boardState[0]]);

  return (
    <div
      ref={chessboardRef}
      onMouseDown={(e) => chessboardService.grabPiece(e)}
      onMouseMove={(e) => chessboardService.movePiece(e)}
      onMouseUp={(e) => chessboardService.dropPiece(e)}
      className="chessboard"
        >
          {chessboardService.getBoardState()}
    </div>
  );
};

export default Chessboard;
