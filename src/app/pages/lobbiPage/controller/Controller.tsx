import React from 'react';
import { NavLink } from 'react-router-dom';
import './controller.scss';

const Controller = () => (
    <div className="controller">
      <button type="button" className="controller__btn">Online</button>
      <NavLink className="controller__btn controller__btn_main" id='linkToGame' to={'/game'}>Start</NavLink>
      <button type="button" className="controller__btn">View replayes</button>
    </div>
);

export default Controller;
