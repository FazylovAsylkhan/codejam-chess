import { PieceTypes, Position, TeamTypes } from '../types/piece';

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
