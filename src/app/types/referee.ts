import { Position } from './piece';

export type BoardState = [JSX.Element[], React.Dispatch<React.SetStateAction<JSX.Element[]>>];
export interface ActionProps {
  initialPosition: Position,
  desiredPosition: Position,
  currentPiece: JSX.Element,
}
export enum ActionTypes {
  NOT_VALID,
  DEFAULT_MOVE,
  EN_PASSANT,
  CASTELING,
}
