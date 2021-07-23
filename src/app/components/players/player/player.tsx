import React, { FC } from 'react';
import { TeamTypes } from '../../../types/piece';

interface PlayerProps {
  setIsVisiblePopup?: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  team: TeamTypes;
  order?: TeamTypes;
}

const Player: FC<PlayerProps> = (props) => {
  const {
    setIsVisiblePopup, name, team, order,
  } = props;
  const colorLabel = team === TeamTypes.LIGHT ? 'players__label-white' : 'players__label-dark';
  const colorText = team === TeamTypes.LIGHT ? 'players__text_white' : 'players__text_dark';
  const classImgOrder = team === TeamTypes.LIGHT ? 'players__img-order_white' : 'players__img-order_dark';

  return (
    <div
    className='players'
    onClick={() => (setIsVisiblePopup ? setIsVisiblePopup(true) : false)}>
      {team === order ? <div className={classImgOrder}></div> : <div></div> }
      <div className={colorLabel}>{name[0]}</div>
      <div className={colorText}>{name}</div>
    </div>
  );
};

export default Player;
