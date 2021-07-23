import React, { FC, useRef } from 'react';
import { usePlayersNameContext } from '../../context/app';

import './popup.scss';

interface PopupProps {
  setIsVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: FC<PopupProps> = (props) => {
  const { setIsVisiblePopup } = props;
  const { setPlayersName } = usePlayersNameContext();
  const firstInput = useRef<HTMLInputElement>(null);
  const secondInput = useRef<HTMLInputElement>(null);
  const validInput = (input: HTMLInputElement) => {
    if (!input.value.length) {
      input.classList.add('popup__not-valid');
    } else {
      input.classList.remove('popup__not-valid');
    }
  };
  const saveChanges = () => {
    const input1 = firstInput.current;
    const input2 = secondInput.current;
    if (input1 && input2) {
      validInput(input1);
      validInput(input2);
      if (input1.value.length && input2.value.length) {
        setPlayersName([input1.value, input2.value]);

        input1.classList.remove('popup__not-valid');
        input2.classList.remove('popup__not-valid');
        input1.value = '';
        input2.value = '';
        setIsVisiblePopup(false);
      }
    }
  };

  return (
        <div className='popup'>
            <h2 className='popup__title'>Add player One to game</h2>
            <div className='popup__wrapper'>
                <input
                ref={firstInput}
                type="text"
                className='popup__input'
                placeholder='Enter new name'
                />
                <div className='popup__subtitle'>Player 1</div>
            </div>
            <div className='popup__wrapper'>
                <input
                ref={secondInput}
                type="text"
                className='popup__input'
                placeholder='Enter new name'
                />
                <div className='popup__subtitle'>Player 2</div>
            </div>
            <button className='popup__button' onClick={saveChanges}>Change</button>
            </div>
  );
};

export default Popup;
