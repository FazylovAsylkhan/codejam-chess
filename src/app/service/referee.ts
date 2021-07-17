import {
  BoardState, ChessboardRef, StateStore,
} from '../types/chessboard';
import { PieceTypes, Position, TeamTypes } from '../types/piece';
import { ActionProps, ActionTypes } from '../types/referee';
import { isSamePosition, isSpaceOccupied, isSpaceOccupiedByOpponent } from './utils';

class Referee {
  boardState: BoardState;

  stateStore: StateStore;

  chessboardRef: ChessboardRef;

  checkSpaces: string[];

  constructor(
    boardState: BoardState, stateStore: StateStore,
    chessboardRef: ChessboardRef,
  ) {
    this.boardState = boardState;
    this.stateStore = stateStore;
    this.chessboardRef = chessboardRef;
    this.checkSpaces = [];
  }

  getTypeAction(props: ActionProps): ActionTypes {
    const {
      NOT_VALID, DEFAULT_MOVE, EN_PASSANT, CASTELING,
    } = ActionTypes;

    if (this.isEnPassantMove(props)) return EN_PASSANT;
    if (this.isCasteling(props)) return CASTELING;
    if (this.isDefaultMove(props)) return DEFAULT_MOVE;
    return NOT_VALID;
  }

  isDefaultMove(props: ActionProps): boolean {
    const { type } = props.currentPiece.props;
    const {
      PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
    } = PieceTypes;

    switch (type) {
      case PAWN:
        return this.isPawnValidMove(props);
      case ROOK:
        return this.isRookValidMove(props);
      case KNIGHT:
        return this.isKnightValidMove(props);
      case BISHOP:
        return this.isBishopValidMove(props);
      case QUEEN:
        return this.isQueenValidMove(props);
      case KING:
        return this.isKingValidMove(props);
      default:
        return false;
    }
  }

  isEnPassantMove(props: ActionProps): boolean {
    const { initialPosition, desiredPosition, currentPiece } = props;
    const { type } = currentPiece.props;
    if (type === PieceTypes.PAWN) {
      const DPX = desiredPosition.x; const DPY = desiredPosition.y;
      const IPX = initialPosition.x; const IPY = initialPosition.y;
      const direction = currentPiece.props.team === TeamTypes.LIGHT ? 1 : -1;

      const isOneStep = DPY - IPY === 1 * direction;
      const isStepByX = Math.abs(DPX - IPX) === 1;

      if (isStepByX && isOneStep) {
        const attackedPosition = { x: DPX, y: DPY - 1 * direction };
        const hasEnPassantPiece = this.boardState[0].find((space) => {
          if (space.props.piece) {
            const { position, enPassant } = space.props.piece.props;
            if (isSamePosition(position, attackedPosition) && enPassant) return true;
          }

          return false;
        });

        return Boolean(hasEnPassantPiece);
      }
    }

    return false;
  }

  isCasteling(props: ActionProps) {
    const [board] = this.boardState;
    const [store] = this.stateStore;
    const { type } = props.currentPiece.props;
    if (type === PieceTypes.KING) {
      const { initialPosition, desiredPosition, currentPiece } = props;
      const DPX = desiredPosition.x; const DPY = desiredPosition.y;
      const IPY = initialPosition.y;
      const specialRow = currentPiece.props.team === TeamTypes.LIGHT ? 0 : 7;
      const isSpecialRow = IPY === specialRow && DPY === specialRow;
      const positionSpace1 = { x: DPX, y: DPY };
      const positionSpace2 = { x: DPX - 1, y: DPY };
      const positionSpace3 = { x: DPX + 1, y: DPY };
      const isEmptyWay = !isSpaceOccupied(board, positionSpace1)
      && !isSpaceOccupied(board, positionSpace2);
      const isRight = DPX === 6;
      const isLeft = DPX === 2;

      if (isSpecialRow && isEmptyWay) {
        const isChopedSpace = board.find((space) => {
          const { piece } = space.props;
          if (piece) {
            const { team, position } = piece.props;
            const isOpponent = currentPiece.props.team !== team;
            if (isOpponent) {
              const space1 = {
                currentPiece: piece,
                initialPosition: position,
                desiredPosition: positionSpace1,
              };
              const space2 = {
                currentPiece: piece,
                initialPosition: position,
                desiredPosition: positionSpace2,
              };
              const space3 = {
                currentPiece: piece,
                initialPosition: position,
                desiredPosition: positionSpace3,
              };
              if (isRight) {
                const isChaped1 = this.isDefaultMove(space1);
                const isChaped2 = this.isDefaultMove(space2);
                if (isChaped1 || isChaped2) return true;
              } else if (isLeft) {
                const isChaped1 = this.isDefaultMove(space1);
                const isChaped2 = this.isDefaultMove(space2);
                const isChaped3 = this.isDefaultMove(space3);
                if (isChaped1 || isChaped2 || isChaped3) return true;
              }
            }
          }

          return false;
        });
        const storePiecesWithCasteling = store[0];
        const positionRook = isRight ? { x: 7, y: specialRow } : { x: 0, y: specialRow };
        const positionKing = { x: 4, y: specialRow };
        const hasCastelingRook = storePiecesWithCasteling.find((p) => isSamePosition(
          p.props.position, positionRook,
        ) && p.props.casteling);
        const hasCastelingKing = storePiecesWithCasteling.find((p) => isSamePosition(
          p.props.position, positionKing,
        ) && p.props.casteling);
        const isValidCasteling = !isChopedSpace && hasCastelingRook && hasCastelingKing;
        if (isValidCasteling) return true;
      }
    }

    return false;
  }

  isCheck(board: JSX.Element[], currentTeam: TeamTypes, ourKingPosition: Position): boolean {
    const arrOpponentPieces: JSX.Element[] = [];
    let checkSpaces: string[] = [];
    let isCheckValue = false;
    let isEmptyWay = true;
    board.forEach((space) => {
      const { positionSpace, piece } = space.props;
      if (piece
        && piece.props.team === currentTeam && piece.props.type === PieceTypes.KING) {
        checkSpaces.push(`${positionSpace.x}-${positionSpace.y}`);
      } else if (space.props.piece && space.props.piece.props.team !== currentTeam) {
        const opponentPosition = space.props.piece.props.position;
        const actionProps = {
          initialPosition: opponentPosition,
          desiredPosition: ourKingPosition,
          currentPiece: space.props.piece,
        };
        if (space.props.piece.props.type === PieceTypes.BISHOP
          && this.isBishopValidMove(actionProps)) {
          const IPX = opponentPosition.x; const IPY = opponentPosition.y;
          const DPX = ourKingPosition.x; const DPY = ourKingPosition.y;
          const isEquilMoveByDioganal = Math.abs(DPX - IPX) === Math.abs(DPY - IPY);

          if (isEquilMoveByDioganal) {
            const maxValue = Math.abs(DPX - IPX);
            const directionByX = DPX - IPX > 0 ? 1 : -1;
            const directionByY = DPY - IPY > 0 ? 1 : -1;
            const stepByX = IPX * directionByX;
            const stepByY = IPY * directionByY;
            const validSpaces = [];

            for (let i = 1; i < maxValue; i += 1) {
              const position = {
                x: Math.abs(stepByX + i),
                y: Math.abs(stepByY + i),
              };
              validSpaces.push(`${position.x}-${position.y}`);
              if (isSpaceOccupied(board, position)) isEmptyWay = false;
            }
            if (isEmptyWay) {
              isCheckValue = true;
              checkSpaces = [...checkSpaces, ...validSpaces];
              arrOpponentPieces.push(space.props.piece);
            }
          }
        } else if (space.props.piece.props.type === PieceTypes.ROOK
          && this.isRookValidMove(actionProps)) {
          const DPX = ourKingPosition.x; const DPY = ourKingPosition.y;
          const IPX = opponentPosition.x; const IPY = opponentPosition.y;
          const isStepsByY = IPX === DPX;
          const isStepsByX = IPY === DPY;
          const validSpaces = [];

          if (isStepsByY || isStepsByX) {
            let start;
            let end;
            if (isStepsByY) {
              start = DPY - IPY > 0 ? IPY + 1 : DPY + 1;
              end = DPY - IPY > 0 ? DPY - 1 : IPY - 1;
              for (let i = start; i <= end; i += 1) {
                const position = { x: DPX, y: i };
                if (isSpaceOccupied(board, position)) isEmptyWay = false;
                validSpaces.push(`${position.x}-${position.y}`);
              }
            }
            if (isStepsByX) {
              start = DPX - IPX > 0 ? IPX + 1 : DPX + 1;
              end = DPX - IPX > 0 ? DPX - 1 : IPX - 1;
              for (let i = start; i <= end; i += 1) {
                const position = { x: i, y: DPY };
                if (isSpaceOccupied(board, position)) isEmptyWay = false;
                validSpaces.push(`${position.x}-${position.y}`);
              }
            }
            if (isEmptyWay) {
              isCheckValue = true;
              checkSpaces = [...checkSpaces, ...validSpaces];
              arrOpponentPieces.push(space.props.piece);
            }
          }
        } else if (this.isDefaultMove(actionProps)) {
          isCheckValue = true;
          arrOpponentPieces.push(space.props.piece);
        }
      }
    });
    this.checkSpaces = checkSpaces;

    return isCheckValue;
  }

  isPawnValidMove(props: ActionProps): boolean {
    const [board] = this.boardState;
    const { initialPosition, desiredPosition, currentPiece } = props;
    const DPX = desiredPosition.x; const DPY = desiredPosition.y;
    const IPX = initialPosition.x; const IPY = initialPosition.y;
    const { team } = currentPiece.props;

    const direction = team === TeamTypes.LIGHT ? 1 : -1;
    const specialRow = team === TeamTypes.LIGHT ? 1 : 6;
    const isOneStep = DPY - IPY === 1 * direction;
    const isTwoSteps = DPY - IPY === 2 * direction;

    const isStepByX = Math.abs(DPX - IPX) === 1;
    const isStepByY = IPX === DPX;
    const isSpecialRow = IPY === specialRow;
    const isEmptySpace = !isSpaceOccupied(board, desiredPosition);

    const position = { x: DPX, y: DPY - 1 * direction };
    const isEmptyWay = isEmptySpace && !isSpaceOccupied(board, position);

    const specialMove = isSpecialRow && isStepByY && isTwoSteps && isEmptyWay;
    const usualMove = isStepByY && isOneStep && isEmptySpace;
    const attack = isStepByX && isOneStep
    && isSpaceOccupiedByOpponent(board, team, desiredPosition);

    if (specialMove || usualMove || attack) return true;

    return false;
  }

  isRookValidMove(props: ActionProps): boolean {
    const [board] = this.boardState;
    const { initialPosition, desiredPosition, currentPiece } = props;
    const DPX = desiredPosition.x; const DPY = desiredPosition.y;
    const IPX = initialPosition.x; const IPY = initialPosition.y;
    const { team } = currentPiece.props;

    const isEmptySpace = !isSpaceOccupied(board, desiredPosition);
    const isStepsByY = IPX === DPX;
    const isStepsByX = IPY === DPY;

    if (isStepsByY || isStepsByX) {
      let start;
      let end;
      let isEmptyWay = true;
      if (isStepsByY) {
        start = DPY - IPY > 0 ? IPY + 1 : DPY + 1;
        end = DPY - IPY > 0 ? DPY - 1 : IPY - 1;
        for (let i = start; i <= end; i += 1) {
          const position = { x: DPX, y: i };
          if (isSpaceOccupied(board, position)) isEmptyWay = false;
        }
      }
      if (isStepsByX) {
        start = DPX - IPX > 0 ? IPX + 1 : DPX + 1;
        end = DPX - IPX > 0 ? DPX - 1 : IPX - 1;
        for (let i = start; i <= end; i += 1) {
          const position = { x: i, y: DPY };
          if (isSpaceOccupied(board, position)) isEmptyWay = false;
        }
      }

      if (isEmptySpace || isSpaceOccupiedByOpponent(board, team, desiredPosition)) {
        if (isEmptyWay) {
          return true;
        }
      }
    }

    return false;
  }

  isKnightValidMove(props: ActionProps): boolean {
    const [board] = this.boardState;
    const { initialPosition, desiredPosition, currentPiece } = props;
    const DPX = desiredPosition.x; const DPY = desiredPosition.y;
    const IPX = initialPosition.x; const IPY = initialPosition.y;
    const { team } = currentPiece.props;

    const isEmptySpace = !isSpaceOccupied(board, desiredPosition);
    const oneStepByX = Math.abs(IPX - DPX) === 1;
    const threeStepsByY = Math.abs(IPY - DPY) === 2;
    const oneStepByY = Math.abs(IPY - DPY) === 1;
    const threeStepsByX = Math.abs(IPX - DPX) === 2;

    const verticalMove = oneStepByX && threeStepsByY;
    const horizontalMove = oneStepByY && threeStepsByX;

    if (verticalMove || horizontalMove) {
      if (isEmptySpace || isSpaceOccupiedByOpponent(board, team, desiredPosition)) {
        return true;
      }
    }

    return false;
  }

  isBishopValidMove(props: ActionProps): boolean {
    const [board] = this.boardState;
    const { initialPosition, desiredPosition, currentPiece } = props;
    const DPX = desiredPosition.x; const DPY = desiredPosition.y;
    const IPX = initialPosition.x; const IPY = initialPosition.y;
    const { team } = currentPiece.props;

    const isEmptySpace = !isSpaceOccupied(board, desiredPosition);
    const isEquilMoveByDioganal = Math.abs(DPX - IPX) === Math.abs(DPY - IPY);
    const areValidSpaces = isEmptySpace || isSpaceOccupiedByOpponent(board, team, desiredPosition);

    if (isEquilMoveByDioganal) {
      const maxValue = Math.abs(DPX - IPX);
      const directionByX = DPX - IPX > 0 ? 1 : -1;
      const directionByY = DPY - IPY > 0 ? 1 : -1;
      const stepByX = IPX * directionByX;
      const stepByY = IPY * directionByY;
      let isEmptyWay = true;
      for (let i = 1; i < maxValue; i += 1) {
        const position = {
          x: Math.abs(stepByX + i),
          y: Math.abs(stepByY + i),
        };
        if (isSpaceOccupied(board, position)) isEmptyWay = false;
      }

      if (areValidSpaces && isEmptyWay) return true;
    }

    return false;
  }

  isQueenValidMove(props: ActionProps): boolean {
    if (this.isBishopValidMove(props)) return true;
    if (this.isRookValidMove(props)) return true;

    return false;
  }

  isKingValidMove(props: ActionProps): boolean {
    const [board] = this.boardState;
    const { initialPosition, desiredPosition, currentPiece } = props;
    const DPX = desiredPosition.x; const DPY = desiredPosition.y;
    const IPX = initialPosition.x; const IPY = initialPosition.y;
    const { team } = currentPiece.props;

    const isStepByY = IPX === DPX;
    const isStepByX = IPY === DPY;
    const isOneStepByX = Math.abs(DPX - IPX) === 1;
    const isOneStepByY = Math.abs(DPY - IPY) === 1;
    const isMoveByPlus = (isStepByX && isOneStepByX) || (isStepByY && isOneStepByY);

    const isMoveByDioganal = (Math.abs(DPX - IPX) === Math.abs(DPY - IPY)) && isOneStepByX;

    const isEmptySpace = !isSpaceOccupied(board, desiredPosition);
    const areValidSpaces = isEmptySpace || isSpaceOccupiedByOpponent(board, team, desiredPosition);

    if (isMoveByPlus && areValidSpaces) return true;
    if (isMoveByDioganal && areValidSpaces) return true;

    return false;
  }
}

export default Referee;
