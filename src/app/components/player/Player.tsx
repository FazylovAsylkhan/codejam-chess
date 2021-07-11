import React, { FC } from 'react';
import './player.scss';

interface PlayerProps {
  name: string;
  img?: string;
}

const Player: FC<PlayerProps> = (props) => {
  const { img = './images/player.png', name } = props;

  return (
    <div className="player">
      <img className="player__img" src={img} alt="player" />
      <div className="player__text">{name}</div>
    </div>
  );
};

export default Player;
