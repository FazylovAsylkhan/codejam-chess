import React, { FC, useEffect, useRef } from 'react';
import ChessboardService from '../../../service';
import { getPositionKing } from '../../../service/utils';
import './chessboard.scss';

interface ChessboardProps {
  initialBoardState: JSX.Element[];
  store: Array<JSX.Element[]>;
}

const Chessboard: FC<ChessboardProps> = (props) => {
  const { initialBoardState, store } = props;
  const chessboardRef = useRef<HTMLDivElement>(null);
  const chessboardService = new ChessboardService(chessboardRef,
    initialBoardState, store);
  const [board] = chessboardService.boardState;
  const [checkSpaces] = chessboardService.stateCheckSpaces;

  useEffect(() => {
    window.console.log(checkSpaces);
    const currentTeam = chessboardService.stateOrder[0];
    const positionKing = getPositionKing(board, currentTeam);
    const hasCheck = chessboardService.referee.isCheck(board, currentTeam, positionKing);
    if (hasCheck) {
      chessboardService.showCheckSteps();
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
          {board}
    </div>
  );
};

export default Chessboard;
