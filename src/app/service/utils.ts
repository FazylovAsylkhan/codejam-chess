import { createPiece } from '../pages/GamePage/chessboard/piece';
import { createSpace } from '../pages/GamePage/chessboard/space/Space';
import { UpdateBoardState } from '../types/chessboard';
import { PieceTypes, Position, TeamTypes } from '../types/piece';
import { ActionTypes } from '../types/referee';

export const getValidedValue = (a: number, b: number, c: number) => {
  if (a < b) {
    return b;
  } if (a > c) {
    return c;
  }
  return a;
};

export function isSamePosition(p1: Position, p2: Position) {
  if (p1.x === p2.x && p1.y === p2.y) return true;

  return false;
}

export function isSpaceOccupied(board: JSX.Element[], desiredPosition: Position): boolean {
  const space = board.find((s) => {
    const { piece } = s.props;
    if (piece) {
      const { position } = piece.props;
      if (isSamePosition(position, desiredPosition)) return true;
    }

    return false;
  });

  return Boolean(space);
}

export function isSpaceOccupiedByOpponent(
  board: JSX.Element[], ourTeam: TeamTypes, desiredPosition: Position,
): boolean {
  const space = board.find((s) => {
    const { piece } = s.props;
    if (piece) {
      const { position, team } = piece.props;
      const isOpponent = team !== ourTeam;
      const hasElement = isSamePosition(position, desiredPosition);
      if (hasElement && isOpponent) return true;
    }

    return false;
  });
  return Boolean(space);
}

export function getPositionKing(board: JSX.Element[], currentTeam: TeamTypes): Position {
  const currentSpaceKing = board.find((space) => {
    if (space.props.piece) {
      const { type, team } = space.props.piece.props;
      if (type === PieceTypes.KING && team === currentTeam) return true;
    }
    return false;
  });

  if (currentSpaceKing && currentSpaceKing.props.piece) {
    const positionKing: Position = currentSpaceKing.props.piece.props.position;
    return positionKing;
  }

  return { x: -1, y: -1 };
}

export function getCastlingProps(
  specialAction: ActionTypes, currentPiece: JSX.Element, desiredPosition: Position,
) {
  const specialRowOnCasteling = currentPiece?.props.team === TeamTypes.LIGHT ? 0 : 7;
  const isRightCasteling = desiredPosition.x === 6;
  const isLeftCasteling = desiredPosition.x === 2;
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
    isNewPosition: (position: Position) => ActionTypes.CASTELING
    && castlingDirection
    && isSamePosition(position, newPositionRookOnCasteling),
  };
}

export function getBishopProps(initialPosition: Position, desiredPosition: Position) {
  const DPX = desiredPosition.x; const DPY = desiredPosition.y;
  const IPX = initialPosition.x; const IPY = initialPosition.y;
  const isEquilMoveByDioganal = Math.abs(DPX - IPX) === Math.abs(DPY - IPY);
  let maxValue = -1;
  let stepByX = -1;
  let stepByY = -1;

  if (isEquilMoveByDioganal) {
    maxValue = Math.abs(DPX - IPX);
    const directionByX = DPX - IPX > 0 ? 1 : -1;
    const directionByY = DPY - IPY > 0 ? 1 : -1;
    stepByX = IPX * directionByX;
    stepByY = IPY * directionByY;
  }

  return {
    maxValue,
    stepByX,
    stepByY,
    isEquilMoveByDioganal,
  };
}

export function getRookProps(initialPosition: Position, desiredPosition: Position) {
  const DPX = desiredPosition.x; const DPY = desiredPosition.y;
  const IPX = initialPosition.x; const IPY = initialPosition.y;

  const isStepsByY = IPX === DPX;
  const isStepsByX = IPY === DPY;
  const isValidMove = isStepsByY || isStepsByX;
  let startWay = -1;
  let endWay = -1;
  if (isStepsByY) {
    startWay = DPY - IPY > 0 ? IPY + 1 : DPY + 1;
    endWay = DPY - IPY > 0 ? DPY - 1 : IPY - 1;
  }
  if (isStepsByX) {
    startWay = DPX - IPX > 0 ? IPX + 1 : DPX + 1;
    endWay = DPX - IPX > 0 ? DPX - 1 : IPX - 1;
  }

  return {
    isValidMove,
    DPX,
    DPY,
    isStepsByY,
    isStepsByX,
    startWay,
    endWay,
  };
}

export function isValidSpace(
  board: JSX.Element[], currentPiece: JSX.Element, desiredPosition: Position,
) {
  const { team } = currentPiece.props;
  const isEmptySpace = !isSpaceOccupied(board, desiredPosition);
  const isVlaidSpace = isEmptySpace || isSpaceOccupiedByOpponent(board, team, desiredPosition);

  return isVlaidSpace;
}

export function getPawnProps(
  currentPiece: JSX.Element, initialPosition: Position, desiredPosition: Position,
) {
  const DPX = desiredPosition.x; const DPY = desiredPosition.y;
  const IPX = initialPosition.x; const IPY = initialPosition.y;

  const direction = currentPiece.props.team === TeamTypes.LIGHT ? 1 : -1;
  const specialRow = currentPiece.props.team === TeamTypes.LIGHT ? 1 : 6;
  const isOneStep = DPY - IPY === 1 * direction;
  const isTwoSteps = DPY - IPY === 2 * direction;

  const isStepByX = Math.abs(DPX - IPX) === 1;
  const isStepByY = IPX === DPX;
  const isSpecialRow = IPY === specialRow;

  return {
    DPX,
    DPY,
    isOneStep,
    isTwoSteps,
    isStepByX,
    isStepByY,
    isSpecialRow,
    direction,
  };
}

export function getUpdateBoardState(props: UpdateBoardState): JSX.Element[] {
  const {
    board, action,
    initialPosition, desiredPosition,
    currentPiece, storePiecesWithCasteling,
  } = props;
  const { CASTELING, EN_PASSANT, PROMOTION } = ActionTypes;
  const {
    ROOK, PAWN, KING, QUEEN,
  } = PieceTypes;
  const updatedBoardState = [] as JSX.Element[];

  board.forEach((space) => {
    const { key } = space;
    const { positionSpace, number, piece } = space.props;
    const direction = currentPiece?.props.team === TeamTypes.LIGHT ? 1 : -1;

    const isInitialSpace = isSamePosition(positionSpace, initialPosition);
    const isDesiredSpace = isSamePosition(positionSpace, desiredPosition);
    let isInitialRook = false;
    let isNewRook = false;
    if (action === CASTELING && currentPiece) {
      const { isInitialPosition, isNewPosition } = getCastlingProps(
        action, currentPiece, desiredPosition,
      );
      isInitialRook = isInitialPosition(positionSpace);
      isNewRook = isNewPosition(positionSpace);
    }

    const attackedPosition = {
      x: desiredPosition.x,
      y: desiredPosition.y - 1 * direction,
    };
    const isAttackedPosition = action === EN_PASSANT
    && isSamePosition(positionSpace, attackedPosition);

    if (isAttackedPosition || isInitialSpace || isInitialRook) {
      const newSpace = createSpace(positionSpace, null, key, number);

      updatedBoardState.push(newSpace);
    } else if (isNewRook) {
      const pieceProps = {
        position: positionSpace,
        type: ROOK,
        team: currentPiece?.props.team,
      };
      const newPiece = createPiece(pieceProps);
      const newSpace = createSpace(positionSpace, newPiece, key, number);

      updatedBoardState.push(newSpace);
    } else if (isDesiredSpace) {
      const initialSpace = board.find((s) => isSamePosition(
        s.props.positionSpace, initialPosition,
      ));
      if (initialSpace) {
        const { type, team } = initialSpace.props.piece.props;
        let pieceProps;
        if (type === PAWN) {
          const enPassant = Math.abs(initialPosition.y - desiredPosition.y) === 2;

          pieceProps = action === PROMOTION
            ? {
              position: positionSpace, type: QUEEN, team, enPassant,
            }
            : {
              position: positionSpace, type, team, enPassant,
            };
        } else {
          pieceProps = { position: positionSpace, type, team };
        }
        const newPiece = createPiece(pieceProps);
        const newSpace = createSpace(positionSpace, newPiece, key, number);

        updatedBoardState.push(newSpace);
      }
    } else if (piece) {
      const { type, team, position } = piece.props;
      let newPiece;
      const specialPiece = type === ROOK || type === KING;
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

  return updatedBoardState;
}
