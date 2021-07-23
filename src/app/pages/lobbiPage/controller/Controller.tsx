import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { usePlayersNameContext } from '../../../context/app';
import './controller.scss';

const Controller: FC = () => {
  const { playersName } = usePlayersNameContext();

  return (
    <div className="controller">
      <button type="button" className="controller__btn">Offline</button>
      {
        playersName.length
          ? <NavLink className="controller__btn controller__btn_main" id='linkToGame' to={'/game'}>Start</NavLink>
          : <div className="controller__btn controller__btn_main">Start</div>
      }
      <button type="button" className="controller__btn">View replayes</button>
    </div>
  );
};

export default Controller;
