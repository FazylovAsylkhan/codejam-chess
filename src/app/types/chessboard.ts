import { Position, TeamTypes } from './piece';
import { ActionTypes } from './referee';

export type ChessboardRef = React.RefObject<HTMLDivElement>;
export type ActivePieceState = [
  HTMLElement | null,
  React.Dispatch<React.SetStateAction<HTMLElement | null>>,
];
export type BoardState = [
  JSX.Element[],
  React.Dispatch<React.SetStateAction<JSX.Element[]>>,
];
export type StateGrabPosition = [
  Position,
  React.Dispatch<React.SetStateAction<Position>>,
];
export type StateOrder = [
  TeamTypes,
  React.Dispatch<React.SetStateAction<TeamTypes>>,
];
export type StateCurrentPiece = [
  JSX.Element | undefined,
  React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
];
export type StateValidSpaces = [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
];

export type StateCheckSpaces = [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
];

export type StateStore = [
  Array<JSX.Element[]>,
  React.Dispatch<React.SetStateAction<Array<JSX.Element[]>>>,
];

export interface UpdateBoardState {
  board: JSX.Element[],
  action: ActionTypes,
  initialPosition:Position,
  desiredPosition: Position,
  currentPiece: JSX.Element,
  storePiecesWithCasteling: JSX.Element[]
}
