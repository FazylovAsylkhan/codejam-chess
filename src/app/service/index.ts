import { useState } from 'react';
import { GRID_SIZE, HIGHT_OF_CHESSBOARD } from '../config/constants';
import { createPiece } from '../pages/GamePage/chessboard/piece';
import { createSpace } from '../pages/GamePage/chessboard/space/Space';
import {
  ActivePieceState, BoardState, ChessboardRef, StateCurrentPiece, StateGrabPosition, StateOrder,
} from '../types/chessboard';
import { Position, PieceTypes, TeamTypes } from '../types/piece';
import Referee from './referee';
import { getValidedValue, isSamePosition } from './utils';

class ChessboardService {
  activePieceState: ActivePieceState;

  boardState: BoardState;

  chessboardRef: ChessboardRef;

  stateGrabPosition: StateGrabPosition;

  referee: Referee;

  desiredPosition: Position = { x: -1, y: -1 };

  grabPosition: Position = { x: -1, y: -1 };

  stateCurrentPiece: StateCurrentPiece;

  stateOrder: StateOrder;

  constructor(chessboardRef: ChessboardRef, initialBoardState: JSX.Element[]) {
    this.activePieceState = useState<HTMLElement | null>(null);
    this.chessboardRef = chessboardRef;
    this.boardState = useState<JSX.Element[]>(initialBoardState);
    this.stateGrabPosition = useState<Position>({ x: -1, y: -1 });
    this.referee = new Referee(this.boardState);
    this.stateOrder = useState<TeamTypes>(TeamTypes.LIGHT);
    this.stateCurrentPiece = useState<JSX.Element | undefined>(undefined);
  }

  grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const element = e.target as HTMLElement;
    const chessboard = this.chessboardRef.current;
    const setGrabPosition = this.stateGrabPosition[1];
    const setActivePiece = this.activePieceState[1];
    const setCurrentPiece = this.stateCurrentPiece[1];
    const [board] = this.boardState;
    const [order] = this.stateOrder;

    if (element.classList.contains('piece') && chessboard) {
      const x = e.clientX;
      const y = e.clientY;
      this.grabPosition = {
        x: Math.floor((x - chessboard.offsetLeft) / GRID_SIZE),
        y: Math.abs(
          Math.ceil(
            (y - chessboard.offsetTop - HIGHT_OF_CHESSBOARD) / GRID_SIZE,
          ),
        ),
      };

      const currentSpace = board.find((space) => {
        if (space.props.piece) {
          const { position, team } = space.props.piece.props;
          if (isSamePosition(position, this.grabPosition) && team === order) {
            return true;
          }
        }

        return false;
      });

      if (currentSpace !== undefined) {
        const currentPiece = currentSpace.props.piece;
        element.style.position = 'absolute';
        element.style.left = `${x - GRID_SIZE / 2}px`;
        element.style.top = `${y - GRID_SIZE / 2}px`;
        setGrabPosition(this.grabPosition);
        setActivePiece(element);
        setCurrentPiece(currentPiece);
      }
    }
  }

  movePiece(e: React.MouseEvent) {
    const chessboard = this.chessboardRef.current;
    const activePiece = this.activePieceState[0];

    if (activePiece && chessboard) {
      const piece = activePiece;
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;

      piece.style.position = 'absolute';
      piece.style.left = `${getValidedValue(x, minX, maxX)}px`;
      piece.style.top = `${getValidedValue(y, minY, maxY)}px`;
    }
  }

  dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const [activePiece, setActivePiece] = this.activePieceState;
    const chessboard = this.chessboardRef.current;
    const [grabPosition] = this.stateGrabPosition;
    const [currentPiece] = this.stateCurrentPiece;

    if (activePiece && chessboard) {
      this.desiredPosition = {
        x: Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE),
        y: Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - HIGHT_OF_CHESSBOARD) / GRID_SIZE),
        ),
      };

      if (currentPiece) {
        const typeAction = this.referee.getTypeAction(
          grabPosition,
          this.desiredPosition,
          currentPiece,
          activePiece,
        );

        if (typeAction) {
          this.updateBoardState(typeAction);
          this.changeOrder();
          setActivePiece(null);
        } else {
          this.resetActivePiece();
          setActivePiece(null);
        }
      }
    }
  }

  updateBoardState(typeAction: PieceTypes | string) {
    const setBoard = this.boardState[1];
    const [grabPosition] = this.stateGrabPosition;

    if (typeAction === 'enPassant') {
      const attackedPosition = {
        x: this.desiredPosition.x,
        y: this.desiredPosition.y - (1 * this.referee.getPieceDirection()),
      };

      setBoard(this.getUpdatedBoard(attackedPosition));
    }

    if (typeAction === 'defaultMovePawn') {
      const enPassantValue = Math.abs(grabPosition.y - this.desiredPosition.y) === 2;

      setBoard(this.getUpdatedBoard(this.desiredPosition, enPassantValue));
    }

    if (typeAction === 'defaultMove') {
      setBoard(this.getUpdatedBoard(this.desiredPosition));
    }
  }

  getSpace(positionSpace: Position) {
    const [board] = this.boardState;

    return board.find((space) => {
      const { piece } = space.props;
      if (piece) {
        const { position } = piece.props;
        if (isSamePosition(position, positionSpace)) {
          return true;
        }
      }

      return false;
    });
  }

  getUpdatedBoard(
    position: Position,
    enPassantValue: boolean = false,
  ) {
    const [board] = this.boardState;
    const updatedPieces = board.reduce((results, space) => {
      const s = this.getNewSpace(space, position, enPassantValue);
      if (s !== null) results.push(s);

      return results;
    }, [] as JSX.Element[]);

    return updatedPieces;
  }

  getNewSpace(
    space: JSX.Element, desiredPosition: Position, enPassantValue: boolean,
  ) {
    const [grabPosition] = this.stateGrabPosition;
    const { key } = space;
    const { positionSpace, number } = space.props;

    if (isSamePosition(positionSpace, desiredPosition)) {
      const initialSpace = this.getSpace(grabPosition);
      if (initialSpace) {
        const { team, type } = initialSpace.props.piece.props;
        window.console.log(space.props.piece?.props.team, 'desiredSpace');
        window.console.log(initialSpace.props.piece.props.team, 'initialSpace for Piece');
        window.console.log('======================================');
        const newPiece = createPiece(positionSpace, type, team, enPassantValue);
        const newSpace = createSpace(positionSpace, newPiece, key, number);
        return newSpace;
      }
    }

    if (isSamePosition(positionSpace, grabPosition)) {
      const newSpace = createSpace(positionSpace, null, key, number);
      return newSpace;
    }

    if (space.props.piece) {
      const { type, team } = space.props.piece.props;
      const newPiece = createPiece(positionSpace, type, team, enPassantValue);
      const newSpace = createSpace(positionSpace, newPiece, key, number);
      return newSpace;
    }

    const newSpace = createSpace(positionSpace, null, key, number);
    return newSpace;
  }

  getBoardState() {
    return this.boardState[0];
  }

  resetActivePiece() {
    const [activePiece] = this.activePieceState;
    if (activePiece) {
      activePiece.style.position = 'relative';
      activePiece.style.removeProperty('top');
      activePiece.style.removeProperty('left');
    }
  }

  changeOrder() {
    const [order, setOrder] = this.stateOrder;
    const value = order === TeamTypes.LIGHT ? TeamTypes.DARK : TeamTypes.LIGHT;

    setOrder(value);
  }
}

export default ChessboardService;
