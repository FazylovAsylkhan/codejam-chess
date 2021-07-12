export enum PieceTypes {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
}

export enum TeamTypes {
  DARK,
  LIGHT,
}

export enum ActionTypes {
  NOT_VALID,
  DEFAULT,
  EN_PASSANT,
}

export interface Position {
  x: number;
  y: number;
}
