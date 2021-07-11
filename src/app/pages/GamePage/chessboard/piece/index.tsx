import React, { FC } from 'react';
import { PieceTypes, Position } from '../../../../types/piece';
import Pawn from '../pieces/Pawn';
import Bishop from '../pieces/Bishop';
import Knight from '../pieces/Knight';
import Rook from '../pieces/Rook';
import Queen from '../pieces/Queen';
import King from '../pieces/King';
import './index.scss';

interface PieceProps {
  type: number;
  team: number;
  position: Position;
  enPassant?: boolean;
}

export const Piece: FC<PieceProps> = (props) => {
  const {
    type, team, position, enPassant,
  } = props;
  const {
    PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
  } = PieceTypes;
  switch (type) {
    case PAWN:
      return <Pawn enPassant={enPassant} type={type} team={team} position={position}/>;
    case BISHOP:
      return <Bishop type={type} team={team} position={position} />;
    case KNIGHT:
      return <Knight type={type} team={team} position={position} />;
    case ROOK:
      return <Rook type={type} team={team} position={position} />;
    case QUEEN:
      return <Queen type={type} team={team} position={position} />;
    case KING:
      return <King type={type} team={team} position={position} />;
    default:
      return <div></div>;
  }
};

export function createPiece(
  position: Position, type: number,
  team: number, enPassant: boolean,
) {
  return <Piece enPassant={enPassant}
      position={position} type={type} team={team} />;
}
