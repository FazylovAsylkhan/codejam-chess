import { useState } from 'react';
import {
  CLASS_INITIAL_SPACE, CLASS_VALID_SPACE, GRID_SIZE, HIGHT_OF_CHESSBOARD,
} from '../config/constants';
import { createPiece } from '../pages/GamePage/chessboard/piece';
import { createSpace } from '../pages/GamePage/chessboard/space/Space';
import {
  ActivePieceState, BoardState, ChessboardRef,
  StateCurrentPiece, StateGrabPosition, StateOrder, StateStore, StateValidSpaces,
} from '../types/chessboard';
import { PieceTypes, Position, TeamTypes } from '../types/piece';
import { ActionTypes } from '../types/referee';
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

  stateStore: StateStore;

  checkSpaces: StateValidSpaces;

  constructor(
    chessboardRef: ChessboardRef, initialBoardState: JSX.Element[], store: Array<JSX.Element[]>,
  ) {
    this.activePieceState = useState<HTMLElement | null>(null);
    this.chessboardRef = chessboardRef;
    this.validSpaces = useState<string[]>([]);
    this.boardState = useState<JSX.Element[]>(initialBoardState);
    this.stateOrder = useState<TeamTypes>(TeamTypes.LIGHT);
    this.stateGrabPosition = useState<Position>({ x: -1, y: -1 });
    this.stateCurrentPiece = useState<JSX.Element | undefined>(undefined);
    this.stateStore = useState<Array<JSX.Element[]>>(store);
    this.checkSpaces = useState<string[]>([]);
    this.referee = new Referee(
      this.boardState, this.stateStore, this.checkSpaces, this.chessboardRef,
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
    const [store, setStore] = this.stateStore;
    const storePiecesWithCasteling = store[0];
    const [grabPosition] = this.stateGrabPosition;
    const [activePiece] = this.activePieceState;
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
        const actionProps = {
          initialPosition: grabPosition,
          desiredPosition: this.desiredPosition,
          currentPiece,
        };
        const typeAction = this.referee.getTypeAction(actionProps);

        if (typeAction !== ActionTypes.NOT_VALID) {
          const { type, position } = currentPiece.props;
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
          this.updateBoardState(typeAction);
          setOrder(newOrder);
        }
        this.resetEffects();
      }
    }
  }

  updateBoardState(specialAction: ActionTypes) {
    const [store] = this.stateStore;
    const storePiecesWithCasteling = store[0];
    const [grabPosition] = this.stateGrabPosition;
    const [currentPiece] = this.stateCurrentPiece;
    const [board, setBoard] = this.boardState;
    const updatedBoardState = [] as JSX.Element[];

    board.forEach((space) => {
      const { key } = space;
      const { positionSpace, number, piece } = space.props;
      const direction = currentPiece?.props.team === TeamTypes.LIGHT ? 1 : -1;

      const isInitialSpace = isSamePosition(positionSpace, grabPosition);
      const isDesiredSpace = isSamePosition(positionSpace, this.desiredPosition);
      let isInitialRook = false;
      let isNEwRook = false;
      if (specialAction === ActionTypes.CASTELING) {
        const { isInitialPosition, isNEwPosition } = this.getCastlingProps(specialAction);
        isInitialRook = isInitialPosition(positionSpace);
        isNEwRook = isNEwPosition(positionSpace);
      }

      const attackedPosition = {
        x: this.desiredPosition.x,
        y: this.desiredPosition.y - 1 * direction,
      };
      const isAttackedPosition = specialAction === ActionTypes.EN_PASSANT
      && isSamePosition(positionSpace, attackedPosition);

      if (isAttackedPosition || isInitialSpace || isInitialRook) {
        const newSpace = createSpace(positionSpace, null, key, number);

        updatedBoardState.push(newSpace);
      } else if (isNEwRook) {
        const pieceProps = {
          position: positionSpace,
          type: PieceTypes.ROOK,
          team: currentPiece?.props.team,
        };
        const newPiece = createPiece(pieceProps);
        const newSpace = createSpace(positionSpace, newPiece, key, number);

        updatedBoardState.push(newSpace);
      } else if (isDesiredSpace) {
        const initialSpace = board.find((s) => isSamePosition(s.props.positionSpace, grabPosition));
        if (initialSpace) {
          const { type, team } = initialSpace.props.piece.props;
          const enPassantValue = Math.abs(grabPosition.y - this.desiredPosition.y) === 2;
          const newPiece = type === PieceTypes.PAWN
            ? createPiece({
              position: positionSpace, type, team, enPassant: enPassantValue,
            })
            : createPiece({ position: positionSpace, type, team });
          const newSpace = createSpace(positionSpace, newPiece, key, number);

          updatedBoardState.push(newSpace);
        }
      } else if (piece) {
        const { type, team, position } = piece.props;
        let newPiece;
        const specialPiece = type === PieceTypes.ROOK || type === PieceTypes.KING;
        if (specialPiece) {
          const hasPiece = (p: JSX.Element) => isSamePosition(p.props.position, position);
          const castelingValue = Boolean(storePiecesWithCasteling.find((p) => hasPiece(p)));
          const pieceProps = {
            position: positionSpace,
            type,
            team,
            casteling: castelingValue,
          };
          newPiece = createPiece(pieceProps);
        } else {
          newPiece = createPiece({ position: positionSpace, type, team });
        }
        const newSpace = createSpace(positionSpace, newPiece, key, number);

        updatedBoardState.push(newSpace);
      } else {
        updatedBoardState.push(space);
      }
    });

    setBoard(updatedBoardState);
  }

  getBoardState() {
    return this.boardState[0];
  }

  resetEffects() {
    const [activePiece, setActivePiece] = this.activePieceState;
    const chessboard = this.chessboardRef.current;
    const [validSpaces, setValidSpaces] = this.validSpaces;

    if (activePiece) {
      activePiece.style.position = 'relative';
      activePiece.style.removeProperty('top');
      activePiece.style.removeProperty('left');
      activePiece.parentElement?.classList.remove(CLASS_INITIAL_SPACE);
    }

    validSpaces.forEach((value) => {
      const s = chessboard?.querySelector(`[data-position="${value}"]`);
      s?.classList.remove(CLASS_VALID_SPACE);
    });

    setValidSpaces([]);
    setActivePiece(null);
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

  getCastlingProps(specialAction: ActionTypes) {
    const [currentPiece] = this.stateCurrentPiece;
    const specialRowOnCasteling = currentPiece?.props.team === TeamTypes.LIGHT ? 0 : 7;
    const isRightCasteling = this.desiredPosition.x === 6;
    const isLeftCasteling = this.desiredPosition.x === 2;
    const initialPositionRookOnCasteling = isRightCasteling
      ? { x: 7, y: specialRowOnCasteling }
      : { x: 0, y: specialRowOnCasteling };
    const newPositionRookOnCasteling = isRightCasteling
      ? { x: 5, y: specialRowOnCasteling }
      : { x: 3, y: specialRowOnCasteling };
    const castlingDirection = isRightCasteling || isLeftCasteling;
    return {
      isInitialPosition: (position: Position) => specialAction === ActionTypes.CASTELING
      && castlingDirection
      && isSamePosition(position, initialPositionRookOnCasteling),
      isNEwPosition: (position: Position) => ActionTypes.CASTELING
      && castlingDirection
      && isSamePosition(position, newPositionRookOnCasteling),
    };
  }

  showCheck() {
    const [board] = this.boardState;
    const [store] = this.stateStore;
    const [checkSpaces] = this.checkSpaces;
    const storePiecesWithCheck = store[1];
    const chessboard = this.chessboardRef.current;
    const currentPiece = storePiecesWithCheck.pop();
    const { position } = currentPiece?.props;
    board.forEach((s) => {
      if (currentPiece) {
        const actionProps = {
          initialPosition: position,
          desiredPosition: s.props.positionSpace,
          currentPiece,
        };
        if (this.referee.isDefaultMove(actionProps)) {
          if (s.props.piece) {
            if (s.props.piece.props.type === PieceTypes.KING) {
              const { x, y } = s.props.positionSpace;
              const validSpace = chessboard?.querySelector(`[data-position="${x}-${y}"]`);
              validSpace?.classList.add('space_valid-check');
              checkSpaces.push(`${x}-${y}`);
            }
          }
        }
      }
    });
    window.console.log(storePiecesWithCheck);
  }
}

export default ChessboardService;
