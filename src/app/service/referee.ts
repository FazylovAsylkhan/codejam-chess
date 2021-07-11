import { PieceTypes, Position, TeamTypes } from '../types/piece';
import { isSamePosition } from './utils';

type BoardState = [JSX.Element[], React.Dispatch<React.SetStateAction<JSX.Element[]>>];

class Referee {
  boardState: BoardState;

  IP: Position = { x: -1, y: -1 };

  DP: Position = { x: -1, y: -1 };

  type: PieceTypes = 0;

  team: TeamTypes = 0;

  activePiece: HTMLElement | null = null;

  constructor(boardState: BoardState) {
    this.boardState = boardState;
  }

  getTypeAction(
    initialPosition: Position,
    desiredPosition: Position,
    currentPiece: JSX.Element,
    activePiece: HTMLElement,
  ) {
    this.IP = initialPosition;
    this.DP = desiredPosition;
    this.type = currentPiece.props.type;
    this.team = currentPiece.props.team;
    this.activePiece = activePiece;

    if (this.isEnPassantMove()) {
      return 'enPassant';
    }

    switch (this.type) {
      case PieceTypes.PAWN:
        if (this.isPawnValidMove()) return 'defaultMovePawn';
        return null;
      case PieceTypes.ROOK:
        if (this.isRookValidMove()) return 'defaultMove';
        return null;
      case PieceTypes.KNIGHT:
        if (this.isKnightValidMove()) return 'defaultMove';
        return null;
      case PieceTypes.BISHOP:
        if (this.isBishopValidMove()) return 'defaultMove';
        return null;
      case PieceTypes.QUEEN:
        if (this.isQueenValidMove()) return 'defaultMove';
        return null;
      case PieceTypes.KING:
        if (this.isKingValidMove()) return 'defaultMove';
        return null;
      default:
        return null;
    }
  }

  isEnPassantMove() {
    if (this.type === PieceTypes.PAWN) {
      const DPX = this.DP.x;
      const DPY = this.DP.y;
      const IPX = this.IP.x;
      const IPY = this.IP.y;

      const isOneStep = DPY - IPY === 1 * this.getPieceDirection();
      const isStepByX = Math.abs(DPX - IPX) === 1;

      if (isStepByX && isOneStep) {
        const attackedPosition = { x: DPX, y: DPY - 1 * this.getPieceDirection() };
        const hasEnPassantPiece = this.boardState[0].find((space) => {
          if (space.props.piece) {
            const { position, enPassant } = space.props.piece.props;
            if (isSamePosition(position, attackedPosition) && enPassant) return true;
          }

          return false;
        });

        return Boolean(hasEnPassantPiece);
      }
    }

    return false;
  }

  isSpaceOccupied(desiredPosition: Position): boolean {
    const [board] = this.boardState;
    const piece = board.find((space) => {
      if (space.props.piece) {
        const { position } = space.props.piece.props;
        if (isSamePosition(position, desiredPosition)) return true;
      }

      return false;
    });

    return Boolean(piece);
  }

  isSpaceOccupiedByOpponent(): boolean {
    const [pieces] = this.boardState;
    const hasPiece = pieces.find((space) => {
      if (space.props.piece) {
        const { position, team } = space.props.piece.props;
        const isOpponent = team !== this.team;
        const hasElement = isSamePosition(position, this.DP);
        if (hasElement && isOpponent) return true;
      }

      return false;
    });
    return Boolean(hasPiece);
  }

  getPieceDirection() {
    return this.team === TeamTypes.LIGHT ? 1 : -1;
  }

  isPawnValidMove() {
    const DPX = this.DP.x; const DPY = this.DP.y;
    const IPX = this.IP.x; const IPY = this.IP.y;
    const specialRow = this.team === TeamTypes.LIGHT ? 1 : 6;
    const isOneStep = DPY - IPY === 1 * this.getPieceDirection();
    const isTwoSteps = DPY - IPY === 2 * this.getPieceDirection();
    const isStepByX = Math.abs(DPX - IPX) === 1;
    const isStepByY = IPX === DPX;
    const isSpecialRow = IPY === specialRow;
    const isEmptySpace = !this.isSpaceOccupied(this.DP);
    const positionBeforeDesiredPosition = {
      x: this.DP.x,
      y: this.DP.y - (1 * this.getPieceDirection()),
    };
    const isEmptyWay = isEmptySpace && !this.isSpaceOccupied(positionBeforeDesiredPosition);

    const specialSteps = isSpecialRow && isStepByY && isTwoSteps && isEmptyWay;
    const usualSteps = isStepByY && isOneStep && isEmptySpace;
    const attack = isStepByX && isOneStep && this.isSpaceOccupiedByOpponent();

    if (specialSteps || usualSteps || attack) return true;

    return false;
  }

  isRookValidMove() {
    const DPX = this.DP.x; const DPY = this.DP.y;
    const IPX = this.IP.x; const IPY = this.IP.y;

    const isEmptySpace = !this.isSpaceOccupied(this.DP);
    const isStepsByY = IPX === DPX;
    const isStepsByX = IPY === DPY;

    if (isStepsByY || isStepsByX) {
      const IPXORY = isStepsByY ? IPY : IPX;
      const DPXORY = isStepsByY ? DPY : DPX;
      const start = IPXORY + (1 * this.getPieceDirection());
      const end = DPXORY - (1 * this.getPieceDirection());
      const isLightTeam = this.team === TeamTypes.LIGHT;
      const startWay = isLightTeam ? start : end;
      const endWay = isLightTeam ? end : start;
      let isEmptyWay = true;

      for (let i = startWay; i <= endWay; i += 1) {
        if (isStepsByY) {
          const position = { x: this.DP.x, y: i };
          if (this.isSpaceOccupied(position)) isEmptyWay = false;
        } else {
          const position = { x: i, y: this.DP.y };
          if (this.isSpaceOccupied(position)) isEmptyWay = false;
        }
      }

      if (isEmptySpace || this.isSpaceOccupiedByOpponent()) {
        if (isEmptyWay) return true;
      }
    }

    return false;
  }

  isKnightValidMove() {
    const DPX = this.DP.x; const DPY = this.DP.y;
    const IPX = this.IP.x; const IPY = this.IP.y;

    const isEmptySpace = !this.isSpaceOccupied(this.DP);
    const oneStepByX = Math.abs(IPX - DPX) === 1;
    const threeStepsByY = Math.abs(IPY - DPY) === 2;
    const oneStepByY = Math.abs(IPY - DPY) === 1;
    const threeStepsByX = Math.abs(IPX - DPX) === 2;

    const verticalMove = oneStepByX && threeStepsByY;
    const horizontalMove = oneStepByY && threeStepsByX;

    if (verticalMove || horizontalMove) {
      if (isEmptySpace || this.isSpaceOccupiedByOpponent()) {
        return true;
      }
    }

    return false;
  }

  isBishopValidMove() {
    const DPX = this.DP.x; const DPY = this.DP.y;
    const IPX = this.IP.x; const IPY = this.IP.y;
    const isEmptySpace = !this.isSpaceOccupied(this.DP);

    const isMoveByX = Math.abs(DPX - IPX) > 0 && Math.abs(DPX - IPX) < 8;
    const isMoveByY = Math.abs(DPY - IPY) > 0 && Math.abs(DPY - IPY) < 8;
    const isEquilMoveByDioganal = isMoveByX === isMoveByY;

    if (isEquilMoveByDioganal) {
      const maxValue = Math.abs(DPX - IPX);
      const directionByX = DPX - IPX > 0 ? 1 : -1;
      const directionByY = DPY - IPY > 0 ? 1 : -1;
      const stepByX = IPX * directionByX;
      const stepByY = IPY * directionByY;
      let isEmptyWay = true;
      for (let i = 1; i < maxValue; i += 1) {
        const position = {
          x: Math.abs(stepByX + i),
          y: Math.abs(stepByY + i),
        };
        if (this.isSpaceOccupied(position)) isEmptyWay = false;
      }

      if (isEmptySpace || this.isSpaceOccupiedByOpponent()) {
        if (isEmptyWay) return true;
      }
    }

    return false;
  }

  isQueenValidMove() {
    if (this.isBishopValidMove()) return true;
    if (this.isRookValidMove()) return true;

    return false;
  }

  isKingValidMove() {
    const DPX = this.DP.x; const DPY = this.DP.y;
    const IPX = this.IP.x; const IPY = this.IP.y;

    const isEmptySpace = !this.isSpaceOccupied(this.DP);
    const isOneStepByX = Math.abs(DPX - IPX) === 1;
    const isOneStepByY = Math.abs(DPY - IPY) === 1;

    if (isOneStepByX || isOneStepByY) {
      if (isEmptySpace || this.isSpaceOccupiedByOpponent()) return true;
    }

    return false;
  }
}

export default Referee;
