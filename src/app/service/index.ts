import { useState } from 'react';
import {
  CLASS_INITIAL_SPACE, CLASS_INITIAL_SPACE_CHECK,
  CLASS_INITIAL_SPACE_CHECKMATE,
  CLASS_VALID_SPACE, CLASS_VALID_SPACE_CHECK,
  CLASS_VALID_SPACE_CHECKMATE, GRID_SIZE, HIGHT_OF_CHESSBOARD,
} from '../config/constants';
import {
  ActivePieceState, BoardState, ChessboardRef,
  StateCheckSpaces,
  StateCurrentPiece, StateGrabPosition, StateOrder, StateStore, StateValidSpaces,
} from '../types/chessboard';
import { PieceTypes, Position, TeamTypes } from '../types/piece';
import { ActionTypes } from '../types/referee';
import Referee from './referee';
import {
  getPositionKing, getUpdateBoardState, getValidedValue, isSamePosition,
} from './utils';

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

  stateStore: StateStore;

  stateCheckSpaces: StateCheckSpaces;

  constructor(
    chessboardRef: ChessboardRef, initialBoardState: JSX.Element[],
    store: Array<JSX.Element[]>, stateOrder: StateOrder,
  ) {
    this.activePieceState = useState<HTMLElement | null>(null);
    this.chessboardRef = chessboardRef;
    this.validSpaces = useState<string[]>([]);
    this.boardState = useState<JSX.Element[]>(initialBoardState);
    this.stateOrder = stateOrder;
    this.stateGrabPosition = useState<Position>({ x: -1, y: -1 });
    this.stateCurrentPiece = useState<JSX.Element | undefined>(undefined);
    this.stateStore = useState<Array<JSX.Element[]>>(store);
    this.stateCheckSpaces = useState<string[]>([]);
    this.referee = new Referee(
      this.boardState, this.stateStore, this.chessboardRef,
    );
  }

  grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const element = e.target as HTMLElement;
    const chessboard = this.chessboardRef.current;
    const [board] = this.boardState;
    const [order] = this.stateOrder;
    const setActivePiece = this.activePieceState[1];
    const setCurrentPiece = this.stateCurrentPiece[1];
    const setGrabPosition = this.stateGrabPosition[1];

    if (element.classList.contains('piece') && chessboard) {
      const grabPosition = {
        x: Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE),
        y: Math.abs(Math.ceil((
          e.clientY - chessboard.offsetTop - HIGHT_OF_CHESSBOARD) / GRID_SIZE)),
      };

      const currentSpace = board.find((space) => {
        const { piece } = space.props;
        if (piece) {
          const { position, team } = piece.props;
          if (isSamePosition(position, grabPosition) && team === order) return true;
        }

        return false;
      });

      if (currentSpace !== undefined) {
        const currentPiece = currentSpace.props.piece;
        element.style.position = 'absolute';
        element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
        element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
        element.parentElement?.classList.add(CLASS_INITIAL_SPACE);
        this.showValidMove(currentPiece, grabPosition);
        setActivePiece(element);
        setCurrentPiece(currentPiece);
        setGrabPosition(grabPosition);
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
    const [board, setBoardState] = this.boardState;
    const [grabPosition] = this.stateGrabPosition;
    const [activePiece] = this.activePieceState;
    const chessboard = this.chessboardRef.current;
    const [currentPiece] = this.stateCurrentPiece;
    const [order, setOrder] = this.stateOrder;
    const { DARK, LIGHT } = TeamTypes;
    const ourTeam = order === DARK ? DARK : LIGHT;
    const opponentTeam = order === DARK ? LIGHT : DARK;

    if (activePiece && chessboard) {
      this.desiredPosition = {
        x: Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE),
        y: Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - HIGHT_OF_CHESSBOARD) / GRID_SIZE),
        ),
      };

      if (currentPiece) {
        const actionProps = {
          initialPosition: grabPosition,
          desiredPosition: this.desiredPosition,
          currentPiece,
        };
        const typeAction = this.referee.getTypeAction(actionProps);
        const storePiecesWithCasteling = this.stateStore[0][0];
        const UpdateProps = {
          board,
          action: typeAction,
          initialPosition: grabPosition,
          desiredPosition: this.desiredPosition,
          currentPiece,
          storePiecesWithCasteling,
        };
        const updatedBoard = getUpdateBoardState(UpdateProps);
        const isOurTeamUnderCheck = this.referee.isCheck(
          updatedBoard, ourTeam,
        );

        if (typeAction !== ActionTypes.NOT_VALID
          && !isOurTeamUnderCheck) {
          this.updateStoreWithCastling();
          setBoardState(updatedBoard);
          setOrder(opponentTeam);
          this.resetCheck();
        }
        this.resetEffects();
      }
    }
  }

  resetEffects() {
    const chessboard = this.chessboardRef.current;
    const [activePiece, setActivePiece] = this.activePieceState;
    const [validSpaces, setValidSpaces] = this.validSpaces;

    if (activePiece) {
      activePiece.style.position = 'relative';
      activePiece.style.removeProperty('top');
      activePiece.style.removeProperty('left');
      activePiece.parentElement?.classList.remove(CLASS_INITIAL_SPACE);
    }

    validSpaces.forEach((position) => {
      const s = chessboard?.querySelector(`[data-position="${position}"]`);
      s?.classList.remove(CLASS_VALID_SPACE);
    });

    setValidSpaces([]);
    setActivePiece(null);
  }

  resetCheck() {
    const [checkSpaces] = this.stateCheckSpaces;
    const chessboard = this.chessboardRef.current;
    checkSpaces.forEach((value) => {
      const s = chessboard?.querySelector(`[data-position="${value}"]`);
      s?.classList.remove(CLASS_VALID_SPACE_CHECK);
      s?.classList.remove(CLASS_INITIAL_SPACE_CHECK);
    });
    this.stateCheckSpaces[1]([]);
  }

  showValidMove(currentPiece: JSX.Element, grabPosition: Position) {
    const [board] = this.boardState;
    const SetValidSpaces = this.validSpaces[1];
    const validSpaces = [] as string[];

    board.forEach((space) => {
      const { positionSpace } = space.props;
      const chessboard = this.chessboardRef.current;
      const actionProps = {
        initialPosition: grabPosition,
        desiredPosition: positionSpace,
        currentPiece,
      };
      const typeAction = this.referee.getTypeAction(actionProps);
      if (typeAction !== ActionTypes.NOT_VALID) {
        const { x, y } = positionSpace;
        const s = chessboard?.querySelector(`[data-position="${x}-${y}"]`);
        s?.classList.add(CLASS_VALID_SPACE);
        validSpaces.push(`${x}-${y}`);
      }
    });

    SetValidSpaces(validSpaces);
  }

  showCheckSteps(isCheckmate = false) {
    const [board] = this.boardState;
    const chessboard = this.chessboardRef.current;
    const currentTeam = this.stateOrder[0];
    const kingPosition = getPositionKing(board, currentTeam);
    const { checkSpaces } = this.referee;
    const setCheckSpaces = this.stateCheckSpaces[1];
    setCheckSpaces(checkSpaces);

    checkSpaces.forEach((position) => {
      const kingPositionInString = `${kingPosition.x}-${kingPosition.y}`;
      if (isCheckmate) {
        if (kingPositionInString === position) {
          const s = chessboard?.querySelector(`[data-position="${position}"]`);
          s?.classList.add(CLASS_INITIAL_SPACE_CHECKMATE);
        } else {
          const s = chessboard?.querySelector(`[data-position="${position}"]`);
          s?.classList.add(CLASS_VALID_SPACE_CHECKMATE);
        }
      } else if (kingPositionInString === position) {
        const s = chessboard?.querySelector(`[data-position="${position}"]`);
        s?.classList.add(CLASS_INITIAL_SPACE_CHECK);
      } else {
        const s = chessboard?.querySelector(`[data-position="${position}"]`);
        s?.classList.add(CLASS_VALID_SPACE_CHECK);
      }
    });
  }

  updateStoreWithCastling() {
    const [store, setStore] = this.stateStore;
    const storePiecesWithCasteling = store[0];
    const [currentPiece] = this.stateCurrentPiece;
    const { type, position } = currentPiece?.props;
    const { ROOK, KING } = PieceTypes;
    if (type === ROOK || type === KING) {
      const pieceIndex = storePiecesWithCasteling.findIndex((p) => isSamePosition(
        p.props.position, position,
      ));
      if (pieceIndex !== -1) {
        storePiecesWithCasteling.splice(pieceIndex, 1);
        setStore(store);
      }
    }
  }
}

export default ChessboardService;
