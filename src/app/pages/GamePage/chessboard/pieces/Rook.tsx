import React, { Component } from 'react';
import { Position, TeamTypes } from '../../../../types/piece';

interface PawnProps {
  team: number;
  position: Position;
  type: number;
}

class Rook extends Component {
  props: PawnProps;

  color: string;

  constructor(props: PawnProps) {
    super(props);
    this.props = props;
    this.color = TeamTypes.DARK === props.team ? 'dark' : 'light';
  }

  render() {
    return (
      <svg
        className='piece'
        viewBox="0 0 77 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path
            className={`${this.color} m`}
            d="M29.7153 22.0901H47.3112V26.8723H29.7153V22.0901V22.0901Z"
            fill="#FFCF70"
          />
          <path
            className={`${this.color} m`}
            d="M20.7144 62.4701L22.9941 60.2297C31.5103 51.8707 32.1654 33.5805 32.244 28.1825V26.8723H44.7432V28.1825C44.7432 33.5936 45.4769 51.8707 53.9931 60.2297L56.2728 62.4701H20.7144Z"
            fill="#FFCF70"
          />
          <path
            className='m'
            d="M27.095 17.3079H49.9184V22.09H27.095V17.3079Z"
            fill="#E27D5F"
          />
          <path
            className={`${this.color} m`}
            d="M24.9591 17.3079L21.4216 1.31055H28.7849L30.2392 7.61255H35.0476V1.31055H41.9654V7.61255H46.7737L48.228 1.31055H55.5913L52.0538 17.3079H24.9591V17.3079Z"
            fill="#FFCF70"
          />
          <path
            className='m'
            d="M15.2639 67.2522H61.7624V75.6374H15.2639V67.2522Z"
            fill="#E27D5F"
          />
          <path
            className={`${this.color} m`}
            d="M17.6221 62.47H59.3777V67.2521H17.6221V62.47V62.47Z"
            fill="#FFCF70"
          />
          <path
            className='m'
            d="M61.7491 65.9944H60.6879V62.4699C60.6879 61.7464 60.1013 61.1598 59.3777 61.1598H57.3076C46.9833 54.753 46.1186 33.6459 46.0793 28.1824H47.2978C48.0213 28.1824 48.608 27.5957 48.608 26.8722V23.4002H49.9182C50.6417 23.4002 51.2283 22.8136 51.2283 22.09V18.618H52.0538C52.6782 18.6332 53.2267 18.2055 53.3639 17.5961L56.849 1.5987C57.0084 0.892836 56.5656 0.191395 55.8597 0.032044C55.7545 0.0082969 55.6468 -0.00234837 55.5389 0.000272006H48.228C47.6035 -0.0149589 47.0551 0.412817 46.9178 1.02222L45.6994 6.26296H43.2755V1.31046C43.2755 0.586908 42.6889 0.000272006 41.9653 0.000272006H35.0475C34.324 0.000272006 33.7374 0.586908 33.7374 1.31046V6.28917H31.2742L30.0557 1.04842C29.9185 0.439021 29.37 0.0112448 28.7455 0.0264757H21.474C20.7506 0.00862444 20.1497 0.580685 20.132 1.30407C20.1294 1.41183 20.1401 1.5196 20.1638 1.6249L23.7144 17.6223C23.8517 18.2317 24.4001 18.6595 25.0246 18.6442H25.85V22.1162C25.85 22.8398 26.4367 23.4264 27.1602 23.4264H28.4704V26.8984C28.4704 27.6219 29.057 28.2086 29.7806 28.2086H30.9991C30.9991 33.6328 30.095 54.7792 19.7708 61.186H17.6221C16.8985 61.186 16.3119 61.7726 16.3119 62.4962V65.9944H15.2506C14.5271 65.9944 13.9404 66.581 13.9404 67.3045V75.6897C13.9404 76.4133 14.5271 76.9999 15.2506 76.9999H61.7491C62.4727 76.9999 63.0593 76.4133 63.0593 75.6897V67.3045C63.0593 66.581 62.4729 65.9944 61.7491 65.9944ZM27.0947 15.9976H26.0072L23.0462 2.62064H27.7367L28.9552 7.86139C29.0977 8.46555 29.6448 8.88677 30.2654 8.87023H35.0868C35.8104 8.87023 36.397 8.2836 36.397 7.56005V2.62064H40.6813V7.59935C40.6813 8.3229 41.268 8.90954 41.9915 8.90954H46.813C47.4336 8.92608 47.9807 8.50485 48.1232 7.90069L49.3417 2.65995H53.9666L50.9925 15.9976H27.0947V15.9976ZM29.7151 20.7798H28.4049V18.618H48.608V20.7798H29.7151ZM46.0007 23.4002V25.562H31.0253V23.4002H46.0007ZM33.567 28.1824H43.4589C43.4589 33.4231 44.1795 52.3946 53.1019 61.1598H23.9241C32.8333 52.4077 33.5408 33.4624 33.567 28.1824ZM18.9322 63.7801H58.0806V65.9944H18.9322V63.7801ZM60.439 74.3271H16.5739V68.6147H60.439V74.3271Z"
            fill="#35231A"
          />
        </g>
      </svg>
    );
  }
}

export default Rook;