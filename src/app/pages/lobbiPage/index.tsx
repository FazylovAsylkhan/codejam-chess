import React, { FC } from 'react';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Controller from './controller/Controller';
import Players from './players/Players';

const initialDate = [
  { id: 1, name: 'Player 1' },
  { id: 2, name: 'Player 2' },
];

const LobbiPage: FC = () => (
  <div>
    <Header />
    <div style= {{ paddingTop: 125, paddingBottom: 340 }}>
      <Players players={initialDate} />
      <Controller />
    </div>
    <Footer />
  </div>

);

export default LobbiPage;
