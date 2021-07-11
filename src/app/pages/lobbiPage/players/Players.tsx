import React, { FC } from 'react';
import { IPlayer } from '../../../types/player';
import Player from '../../../components/player/Player';
import './players.scss';

interface PlayersProps {
  players: IPlayer[] | null;
}

const Players: FC<PlayersProps> = ({ players }) => {
  if (!players) return <div> </div>;

  return (
    <div className="players">
      {players.map((player) => (
        <Player key={player.id} name={player.name} img={player.img} />
      ))}
    </div>
  );
};

export default Players;
