import React, { FC } from 'react';
import { PieceTypes, Position, TeamTypes } from '../../../../types/piece';
import './index.scss';

interface PieceProps {
  type: number;
  team: number;
  position: Position;
  enPassant?: boolean;
}

export const Piece: FC<PieceProps> = (props) => {
  const { type, team } = props;
  const {
    PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
  } = PieceTypes;
  const color = TeamTypes.DARK === team ? 'd' : 'l';
  switch (type) {
    case PAWN:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/pawn-${color}.png`} alt="piece" /></div>;
    case BISHOP:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/bishop-${color}.png`} alt="piece" /></div>;
    case KNIGHT:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/knight-${color}.png`} alt="piece" /></div>;
    case ROOK:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/rook-${color}.png`} alt="piece" /></div>;
    case QUEEN:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/queen-${color}.png`} alt="piece" /></div>;
    case KING:
      return <div className="piece"><img className="piece__img" src={`./images/pieces/king-${color}.png`} alt="piece" /></div>;
    default:
      return <div></div>;
  }
};

export function createPiece(
  position: Position, type: number,
  team: number, enPassant: boolean = false,
) {
  return <Piece enPassant={enPassant}
      position={position} type={type} team={team} />;
}
