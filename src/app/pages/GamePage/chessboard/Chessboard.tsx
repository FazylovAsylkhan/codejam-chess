import React, { FC, useRef } from 'react';
import ChessboardService from '../../../service';
import './chessboard.scss';

interface ChessboardProps {
  initialBoardState: JSX.Element[];
}

const Chessboard: FC<ChessboardProps> = (props) => {
  const { initialBoardState } = props;
  const chessboardRef = useRef<HTMLDivElement>(null);
  const chessboardService = new ChessboardService(chessboardRef, initialBoardState);

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
