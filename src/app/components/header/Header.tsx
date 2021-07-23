import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './header.scss';
import Watch from './watch/watch';

interface HeaderProps {
  isGamePage?: boolean;
}

const Header: FC<HeaderProps> = (props) => {
  const { isGamePage } = props;

  return (
    <header className="header">
      <div className="header__logo">
        <img className="header__img" src="./images/logo.png" alt="logo" />
        <span className="header__text">Chess</span>
      </div>
      { isGamePage ? <Watch /> : <div></div> }
      { isGamePage ? <NavLink id='linkToLobbi' to={'/'} className="header__button">admit loss</NavLink> : <div></div> }
    </header>
  );
};

export default Header;
