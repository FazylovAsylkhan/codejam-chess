import { Position } from '../types/piece';

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
