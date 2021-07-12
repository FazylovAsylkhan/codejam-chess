import { useState } from 'react';
import { GRID_SIZE, HIGHT_OF_CHESSBOARD } from '../config/constants';
import { createPiece } from '../pages/GamePage/chessboard/piece';
import { createSpace } from '../pages/GamePage/chessboard/space/Space';
import {
  ActivePieceState, BoardState, ChessboardRef,
  StateCurrentPiece, StateGrabPosition, StateOrder, StateValidSpaces,
} from '../types/chessboard';
import {
  ActionTypes, PieceTypes, Position, TeamTypes,
} from '../types/piece';
import Referee from './referee';
import { getValidedValue, isSamePosition } from './utils';

class ChessboardService {
  activePieceState: ActivePieceState;

  boardState: BoardState;

  validSpaces: StateValidSpaces;

  chessboardRef: ChessboardRef;

  referee: Referee;

  desiredPosition: Position = { x: -1, y: -1 };

  stateGrabPosition: StateGrabPosition;

  stateCurrentPiece: StateCurrentPiece;

  stateOrder: StateOrder;

  constructor(chessboardRef: ChessboardRef, initialBoardState: JSX.Element[]) {
    this.activePieceState = useState<HTMLElement | null>(null);
    this.chessboardRef = chessboardRef;
    this.validSpaces = useState<string[]>([]);
    this.boardState = useState<JSX.Element[]>(initialBoardState);
    this.referee = new Referee(this.boardState);
    this.stateOrder = useState<TeamTypes>(TeamTypes.LIGHT);
    this.stateGrabPosition = useState<Position>({ x: -1, y: -1 });
    this.stateCurrentPiece = useState<JSX.Element | undefined>(undefined);
  }

  grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const element = e.target as HTMLElement;
    const chessboard = this.chessboardRef.current;
    const [board] = this.boardState;
    const [order] = this.stateOrder;
    const setActivePiece = this.activePieceState[1];
    const setCurrentPiece = this.stateCurrentPiece[1];
    const setGrabPosition = this.stateGrabPosition[1];

    if (element.classList.contains('piece') && chessboard) {
      e.preventDefault();
      const X = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const Y = Math.abs(Math.ceil((
        e.clientY - chessboard.offsetTop - HIGHT_OF_CHESSBOARD) / GRID_SIZE));
      const grabPosition = { x: X, y: Y };
      setGrabPosition(grabPosition);

      const currentSpace = board.find((space) => {
        if (space.props.piece) {
          const { position, team } = space.props.piece.props;
          if (isSamePosition(position, grabPosition) && team === order) {
            return true;
          }
        }

        return false;
      });

      if (currentSpace !== undefined) {
        const currentPiece = currentSpace.props.piece;
        element.style.position = 'absolute';
        element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
        element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
        element.parentElement?.classList.add('space_initial');
        this.showValidMove(currentPiece, grabPosition);
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
      const minX = chessboard.offsetLeft - GRID_SIZE * 0.1;
      const minY = chessboard.offsetTop;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - GRID_SIZE * 0.65;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - GRID_SIZE * 0.80;
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;

      piece.style.position = 'absolute';
      piece.style.left = `${getValidedValue(x, minX, maxX)}px`;
      piece.style.top = `${getValidedValue(y, minY, maxY)}px`;
    }
  }

  dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const [grabPosition] = this.stateGrabPosition;
    const [activePiece, setActivePiece] = this.activePieceState;
    const chessboard = this.chessboardRef.current;
    const [currentPiece] = this.stateCurrentPiece;
    const [order, setOrder] = this.stateOrder;
    const newOrder = order === TeamTypes.LIGHT ? TeamTypes.DARK : TeamTypes.LIGHT;

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
        );

        if (typeAction !== ActionTypes.NOT_VALID) {
          this.updateBoardState(typeAction);
          setOrder(newOrder);
          setActivePiece(null);
          this.resetValidMove();
          activePiece.parentElement?.classList.remove('space_initial');
        } else {
          this.resetActivePiece();
          setActivePiece(null);
          this.resetValidMove();
          activePiece.parentElement?.classList.remove('space_initial');
        }
      }
    }
  }

  updateBoardState(specialAction: ActionTypes) {
    const [grabPosition] = this.stateGrabPosition;
    const [board, setBoard] = this.boardState;
    const updatedBoardState = [] as JSX.Element[];

    board.forEach((space) => {
      const { key } = space;
      const { positionSpace, number } = space.props;
      const attackedPosition = {
        x: this.desiredPosition.x,
        y: this.desiredPosition.y - (1 * this.referee.getPieceDirection()),
      };

      if (specialAction === ActionTypes.EN_PASSANT
        && isSamePosition(positionSpace, attackedPosition)) {
        const newSpace = createSpace(positionSpace, null, key, number);
        updatedBoardState.push(newSpace);
      } else if (isSamePosition(positionSpace, grabPosition)) {
        const newSpace = createSpace(positionSpace, null, key, number);
        updatedBoardState.push(newSpace);
      } else if (isSamePosition(positionSpace, this.desiredPosition)) {
        const initialSpace = board.find((s) => isSamePosition(
          s.props.positionSpace, grabPosition,
        ));
        if (initialSpace) {
          const { type, team } = initialSpace.props.piece.props;
          const enPassantValue = Math.abs(grabPosition.y - this.desiredPosition.y) === 2;
          const newPiece = type === PieceTypes.PAWN
            ? createPiece(positionSpace, type, team, enPassantValue)
            : createPiece(positionSpace, type, team);
          const newSpace = createSpace(positionSpace, newPiece, key, number);
          updatedBoardState.push(newSpace);
        }
      } else {
        updatedBoardState.push(space);
      }
    });

    setBoard(updatedBoardState);
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

  showValidMove(currentPiece: JSX.Element, grabPosition: Position) {
    const [board] = this.boardState;
    const SetValidSpaces = this.validSpaces[1];
    const validSpaces = [] as string[];

    board.forEach((space) => {
      const { positionSpace } = space.props;
      const chessboard = this.chessboardRef.current;
      const typeAction = this.referee.getTypeAction(
        grabPosition,
        positionSpace,
        currentPiece,
      );
      if (typeAction === ActionTypes.DEFAULT || typeAction === ActionTypes.EN_PASSANT) {
        const { x, y } = positionSpace;
        validSpaces.push(`${x}-${y}`);
        const s = chessboard?.querySelector(`[data-position="${x}-${y}"]`);
        s?.classList.add('space_valid');
      }
    });
    SetValidSpaces(validSpaces);
  }

  resetValidMove() {
    const chessboard = this.chessboardRef.current;
    const [validSpaces, setValidSpaces] = this.validSpaces;
    validSpaces.forEach((value) => {
      const s = chessboard?.querySelector(`[data-position="${value}"]`);
      s?.classList.remove('space_valid');
    });
    setValidSpaces([]);
  }
}

export default ChessboardService;
