import React, { FC } from 'react';
import { Position } from '../../../../types/piece';
import './space.scss';

interface SpaceProps {
  number: number;
  piece?: JSX.Element | null;
  positionSpace: Position;
}

export const Space: FC<SpaceProps> = (props) => {
  const { number, piece, positionSpace } = props;
  const isEven = number % 2 === 0;
  const { x, y } = positionSpace;

  if (isEven) {
    return <div data-position={`${x}-${y}`} className='space space_dark'> {piece}</div>;
  }
  return <div data-position={`${x}-${y}`} className='space space_light'> {piece} </div>;
};

export function createSpace(
  position: Position, piece: JSX.Element | null,
  key: React.Key | null, number: number,
) {
  return <Space key={key} piece={piece}
    positionSpace={position} number = {number} />;
}
