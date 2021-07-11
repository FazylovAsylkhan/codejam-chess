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

export interface Position {
  x: number;
  y: number;
}
