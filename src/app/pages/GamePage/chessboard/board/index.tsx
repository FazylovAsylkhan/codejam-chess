import {
  HORIZONTAL_AXIS, VERTICAL_AXIS, MAX_PIECES_PER_ROW, ROW, pieceTypes,
} from '../../../../config/constants';
import { isSamePosition } from '../../../../service/utils';
import { PieceTypes, TeamTypes } from '../../../../types/piece';
import { Piece } from '../piece';
import { Space } from '../space/Space';

function getInitialPiecesState() {
  const arrayPieces: JSX.Element[] = [];
  const [FIRST, SECOND, SEVENTH, EIGHTH] = ROW;
  const { DARK, LIGHT } = TeamTypes;
  const { PAWN } = PieceTypes;

  for (let i = 0; i < MAX_PIECES_PER_ROW; i += 1) {
    const arrElements = [
    <Piece position={{ x: i, y: FIRST }} type={pieceTypes[i]} team={LIGHT} />,
    <Piece position={{ x: i, y: SECOND }} type={PAWN} team={LIGHT} />,
    <Piece position={{ x: i, y: SEVENTH }} type={PAWN} team={DARK} />,
    <Piece position={{ x: i, y: EIGHTH }} type={pieceTypes[i]} team={DARK} />,
    ];
    arrElements.forEach((element) => arrayPieces.push(element));
  }

  return arrayPieces;
}

export default function getInitialBoardState() {
  window.console.log('getInitialBoardState');
  const board = [];
  const pieces = getInitialPiecesState();

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j -= 1) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i += 1) {
      const number = i + j + 2;
      const piece = pieces.find((p) => isSamePosition(p.props.position, { x: i, y: j }));
      const element = piece || null;

      board.push(<Space key={`${j},${i}`} positionSpace={{ x: i, y: j }} piece={element} number = {number} />);
    }
  }

  return board;
}
