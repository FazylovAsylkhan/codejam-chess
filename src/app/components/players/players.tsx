import React, { FC } from 'react';
import { usePlayersNameContext } from '../../context/app';
import { TeamTypes } from '../../types/piece';
import Player from './player/player';
import './players.scss';

interface PlayerProps {
  setIsVisiblePopup?: React.Dispatch<React.SetStateAction<boolean>>;
  isGamePage?: boolean;
  order?: TeamTypes;
}

const Players: FC<PlayerProps> = (props) => {
  const { setIsVisiblePopup, isGamePage, order } = props;
  const { playersName } = usePlayersNameContext();
  const classWrapper = isGamePage ? 'players__wrapper zIndex' : 'players__wrapper';
  const getPlayers = () => {
    if (!playersName.length) {
      return (
        <div className={classWrapper}>
          <div
          key={1}
          className='players'
          onClick={() => (setIsVisiblePopup ? setIsVisiblePopup(true) : false)}>
            <img className="players__img" src={'./images/player.png'} alt="player" />
            <div className="players__text_white">Player 1</div>
          </div>
          <div
          key={2}
          className='players'
          onClick={() => (setIsVisiblePopup ? setIsVisiblePopup(true) : false)}>
            <img className="players__img" src={'./images/player.png'} alt="player" />
            <div className="players__text_dark">Player 2</div>
          </div>
        </div>
      );
    }

    return (
      <div className={classWrapper}>
        <Player key={1} name={playersName[0]} team={TeamTypes.LIGHT} order={order}
        setIsVisiblePopup={() => (setIsVisiblePopup ? setIsVisiblePopup(true) : false)}/>
        <Player key={2} name={playersName[1]} team={TeamTypes.DARK} order={order}
        setIsVisiblePopup={() => (setIsVisiblePopup ? setIsVisiblePopup(true) : false)}/>
      </div>
    );
  };

  return (
    getPlayers()
  );
};

export default Players;
