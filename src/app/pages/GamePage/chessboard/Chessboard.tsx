import React, { FC, useEffect, useRef } from 'react';
import ChessboardService from '../../../service';
import { getUpdateBoardState, isSpaceOccupied } from '../../../service/utils';
import { ActionProps, ActionTypes } from '../../../types/referee';
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
  let isNotCheckmate = true;

  useEffect(() => {
    const currentTeam = chessboardService.stateOrder[0];
    let hasCheck = chessboardService.referee.isCheck(board, currentTeam);
    if (hasCheck) {
      board.forEach((space) => {
        const { piece } = space.props;
        if (piece && piece.props.team === currentTeam) {
          board.forEach((s) => {
            if (!isSpaceOccupied(board, s.props.positionSpace)) {
              const actionProps: ActionProps = {
                initialPosition: piece.props.position,
                desiredPosition: s.props.positionSpace,
                currentPiece: piece,
              };
              const typeAction = chessboardService.referee.getTypeAction(actionProps);
              if (typeAction !== ActionTypes.NOT_VALID) {
                const storePiecesWithCasteling = chessboardService.stateStore[0][0];
                const UpdateProps = {
                  board,
                  action: typeAction,
                  initialPosition: piece.props.position,
                  desiredPosition: s.props.positionSpace,
                  currentPiece: piece,
                  storePiecesWithCasteling,
                };
                const updatedBoard = getUpdateBoardState(UpdateProps);
                hasCheck = chessboardService.referee.isCheck(
                  updatedBoard, currentTeam,
                );
                if (!hasCheck) isNotCheckmate = false;
              }
            }
          });
        }
      });
      if (isNotCheckmate) {
        chessboardService.showCheckSteps(true);
        window.console.log('checkmate');
      } else {
        window.console.log('NotCheckmate');
      }
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
