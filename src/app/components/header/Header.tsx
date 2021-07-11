import React, { FC } from 'react';
import './header.scss';

const Header: FC = () => (
  <header className="header">
    <div className="header__logo">
      <img className="header__img" src="./images/logo.png" alt="logo" />
      <span className="header__text">Chess</span>
    </div>
  </header>
);

export default Header;
