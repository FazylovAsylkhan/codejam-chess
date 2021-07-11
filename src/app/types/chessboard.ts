import { Position, TeamTypes } from './piece';

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
