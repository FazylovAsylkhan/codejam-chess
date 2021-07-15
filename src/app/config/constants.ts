import { PieceTypes, TeamTypes } from '../types/piece';

const {
  ROOK, KNIGHT, BISHOP, QUEEN, KING,
} = PieceTypes;
const { LIGHT, DARK } = TeamTypes;

export const VERTICAL_AXIS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const MAX_PIECES_PER_ROW = 8;
export const ROW = [0, 1, 6, 7];
export const GRID_SIZE = 91;
export const HIGHT_OF_CHESSBOARD = 738;
export const pieceTypes = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];

export const CLASS_INITIAL_SPACE = 'space_initial';
export const CLASS_VALID_SPACE = 'space_valid';
export const InitialPropsPiece = [
  [ROOK, { x: 0, y: 0 }, LIGHT],
  [ROOK, { x: 7, y: 0 }, LIGHT],
  [KING, { x: 4, y: 0 }, LIGHT],
  [ROOK, { x: 0, y: 7 }, DARK],
  [ROOK, { x: 7, y: 7 }, DARK],
  [KING, { x: 4, y: 7 }, DARK],
];
