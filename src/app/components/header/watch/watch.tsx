import React, { FC } from 'react';
import './watch.scss';

const Watch: FC = () => {
  const numbersForDigitTenner = '0 1 2 3 4 5 6';
  const numbersForDigitUnits = '0 1 2 3 4 5 6 7 8 9';
  const createDigit = (classItem: string, text: string) => <div className={classItem}>{text}</div>;

  const createWatch = () => (
      <div className="watch start">
        {createDigit('watch__item watch__min_1', numbersForDigitTenner)}
        {createDigit('watch__item watch__min_2', numbersForDigitUnits)}
        {createDigit('watch__item watch__sec_1', numbersForDigitTenner)}
        {createDigit('watch__item watch__sec_2', numbersForDigitUnits)}
      </div>
  );

  return createWatch();
};

export default Watch;
