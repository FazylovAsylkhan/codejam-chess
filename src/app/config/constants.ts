import { PieceTypes } from '../types/piece';

export const VERTICAL_AXIS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const MAX_PIECES_PER_ROW = 8;
export const ROW = [0, 1, 6, 7];
export const GRID_SIZE = 100;
export const HIGHT_OF_CHESSBOARD = 800;
const {
  ROOK, KNIGHT, BISHOP, QUEEN, KING,
} = PieceTypes;
export const pieceTypes = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
