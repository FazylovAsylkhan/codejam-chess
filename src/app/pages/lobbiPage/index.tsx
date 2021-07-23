import React, { FC, useState } from 'react';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Players from '../../components/players/players';
import Popup from '../../components/popup';
import Controller from './controller/Controller';

const LobbiPage: FC = () => {
  const [isVisiblePopup, setIsVisiblePopup] = useState<boolean>(false);

  return (
    <div>
      <Header />
      <div>
      <Players setIsVisiblePopup={setIsVisiblePopup} />
        {isVisiblePopup
          ? <Popup setIsVisiblePopup={setIsVisiblePopup} />
          : <Controller />}
      </div>
      <Footer />
    </div>

  );
};

export default LobbiPage;
