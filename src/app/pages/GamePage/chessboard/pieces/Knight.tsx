import React, { Component } from 'react';
import { Position, TeamTypes } from '../../../../types/piece';

interface PawnProps {
  team: number;
  position: Position;
  type: number;
}

class Knight extends Component {
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
        viewBox="0 0 78 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path
            className='m'
            d="M63.8617 9.82859C58.7796 4.45916 51.7413 1.37438 44.3489 1.27637C41.318 1.29741 38.3087 1.78659 35.4273 2.72682L32.6906 3.61625L34.8936 4.98461C34.054 4.52895 33.1337 4.24091 32.1843 4.13623H31.8011L31.4454 4.30043C28.5564 5.63116 25.8064 7.24462 23.2352 9.11704C22.51 9.63702 21.7985 10.198 20.9774 10.8959L18.3228 13.1537L21.8121 13.3042H21.9763H21.0048C20.2688 13.3039 19.5331 13.3449 18.8018 13.4274H18.2955L17.9534 13.8105C15.3764 16.6586 13.4152 20.0079 12.1926 23.649L11.3853 26.0436L13.3968 25.5236C12.6597 25.7475 12.0007 26.1743 11.4947 26.7551L11.2895 27.0151V27.3435C10.6241 30.9278 10.5318 34.595 11.0158 38.2083L11.3579 40.945L13.2326 38.9609L13.3694 38.8377C12.7555 39.4223 12.2094 40.0742 11.741 40.7808L11.4263 41.2597L11.5495 41.8207C12.2159 44.9226 13.2207 47.9419 14.5462 50.8245L14.6967 51.1529L22.3047 56.4895L21.4837 52.9865C20.3666 47.4905 20.5921 41.806 22.1405 36.4157C27.614 15.1241 47.8793 9.62333 48.1393 9.5686L56.1715 16.1504L65.0248 11.1012L63.8617 9.82859Z"
            fill="#E27D5F"
          />
          <path
            className='m'
            d="M17.324 69.7625H61.9597V76.5769H17.324V69.7625V69.7625Z"
            fill="#E27D5F"
          />
          <path
            className={`${this.color} m`}
            d="M21.4292 62.9481H57.8411V69.7625H21.4292V62.9481V62.9481Z"
            fill="#FFCF70"
          />
          <path
            className={`${this.color} m`}
            d="M45.3344 31.9138L51.9162 34.2811L52.6414 41.3828L61.9599 45.5837L67.4333 36.4568L66.9954 35.7452C62.562 28.5887 57.4169 19.7902 56.2265 16.5882L56.1033 16.2325L48.0574 9.59595L47.3459 9.82857C43.9934 10.8959 27.0258 17.2314 22.1271 36.4704C17.8167 53.3833 25.1238 61.1966 26.629 62.5923L27.0258 62.9618H53.5719L53.9687 62.305C55.0907 60.4577 57.4717 55.8053 55.1865 52.3707C53.2024 49.374 43.8429 36.0599 41.0241 32.0643L40.942 31.9412L44.0208 24.8257L45.3344 31.9138Z"
            fill="#FFCF70"
          />
          <path
            className='m'
            d="M57.8001 16.7935L65.6682 12.319C66.3258 11.9468 66.5572 11.1117 66.1849 10.4541C66.1532 10.3981 66.1178 10.3446 66.0787 10.2938C57.5432 0.235882 43.3185 -2.83915 31.3909 2.79522L31.1582 2.90469C28.0799 4.27869 25.1541 5.97083 22.4281 7.95392C8.58037 17.9292 8.18355 31.8043 10.1129 41.2734C10.1034 41.5003 10.1504 41.7259 10.2498 41.9302C10.9543 45.3528 12.0661 48.6787 13.5612 51.8371C13.6609 52.0329 13.8065 52.2019 13.9854 52.3297L21.7029 57.8031C22.3197 59.1412 23.0815 60.4078 23.9744 61.5798H21.4292C20.6736 61.5798 20.0609 62.1924 20.0609 62.9481V68.4215H17.3242C16.5685 68.4215 15.9558 69.0342 15.9558 69.7899V76.6317C15.9558 77.3873 16.5685 78 17.3242 78H61.9599C62.7156 78 63.3283 77.3873 63.3283 76.6317V69.7899C63.3283 69.0342 62.7156 68.4215 61.9599 68.4215H59.2232V62.9481C59.2232 62.1924 58.6105 61.5798 57.8548 61.5798H55.9391C57.1843 59.103 58.5664 54.9706 56.336 51.6044C54.3108 48.5393 44.7186 34.8558 42.5019 31.7633L43.4871 29.4918L43.9797 32.2285C44.0666 32.7059 44.3998 33.1017 44.8555 33.2685L50.6162 35.3484L51.3415 41.5333C51.39 42.0177 51.6923 42.4397 52.1351 42.6417L61.4536 46.8426C61.5549 46.8824 61.6606 46.91 61.7683 46.9247H61.9189C62.0548 46.9454 62.1934 46.9454 62.3294 46.9247C62.4893 46.8703 62.6378 46.7868 62.7672 46.6784C62.817 46.6272 62.8629 46.5723 62.9041 46.5142C62.9646 46.4555 63.0195 46.3913 63.0683 46.3226L68.5417 37.1957C68.7861 36.7723 68.7861 36.2506 68.5417 35.8273C66.0513 31.6675 59.62 21.0764 57.8001 16.7935ZM20.8545 36.1283C19.2419 41.728 19.0165 47.636 20.1977 53.3423L15.7642 50.2771C14.4865 47.4905 13.5183 44.5721 12.877 41.5744C13.5475 40.5618 14.9706 38.8377 16.5168 38.6598C17.2725 38.5729 17.8147 37.8898 17.7278 37.1341C17.6409 36.3784 16.9578 35.8362 16.2021 35.9231C14.6998 36.1651 13.3193 36.8962 12.2749 38.003C11.8109 34.5354 11.8986 31.0163 12.5349 27.5761C12.6307 27.453 13.9033 25.9752 17.5294 26.7551C18.2851 26.9138 19.0264 26.4298 19.1851 25.6741C19.3439 24.9184 18.8598 24.1771 18.1041 24.0184C16.575 23.6512 14.9809 23.6512 13.4517 24.0184C14.61 20.5539 16.4736 17.367 18.9251 14.6589C21.1537 14.3559 23.4222 14.5809 25.548 15.3157C25.7209 15.3894 25.9073 15.4267 26.0953 15.4251C26.851 15.4313 27.4686 14.8237 27.4748 14.0681C27.4792 13.5156 27.151 13.0144 26.6427 12.7979C25.114 12.183 23.4869 11.8493 21.8397 11.8127C22.5239 11.2243 23.2081 10.6496 24.0154 10.1022C26.5169 8.28044 29.1938 6.71282 32.0066 5.42246C33.4343 5.56802 34.7303 6.32079 35.5643 7.48868C35.9687 8.12719 36.8142 8.31722 37.4527 7.91287C38.0912 7.50852 38.2812 6.66305 37.8769 6.02454C37.355 5.20729 36.6588 4.51558 35.838 3.99937C45.3941 0.736187 55.9756 3.38823 62.863 10.7727L56.2402 14.5357L48.9332 8.55599C48.5981 8.27856 48.1512 8.17696 47.729 8.28232C47.5238 8.33706 26.4648 13.9063 20.8135 36.1283H20.8545ZM60.5915 71.1309V75.2359H18.6925V71.1309H60.5915ZM56.4865 64.2891V68.3942H22.7976V64.2891H56.4728H56.4865ZM62.2883 42.2723L60.7694 37.3872C60.5428 36.6656 59.7738 36.2643 59.0522 36.491C58.3305 36.7176 57.9292 37.4866 58.1559 38.2082L59.7432 43.0659L53.914 40.466L53.2572 34.1442C53.2031 33.619 52.8516 33.1717 52.3541 32.9948L46.5112 30.8875L45.3481 24.5521C45.2118 23.8087 44.4988 23.3166 43.7555 23.4528C43.3079 23.5349 42.9304 23.834 42.7482 24.251L39.6694 31.3665C39.4659 31.8141 39.518 32.3365 39.8062 32.7348C39.9294 32.899 51.8067 49.7708 54.0371 53.137C55.8981 55.9558 53.7087 60.1019 52.7919 61.6071H27.5731C26.0132 60.1567 19.363 52.8907 23.4681 36.8262C28.1752 18.3534 44.3355 12.1958 47.7701 11.1559L54.9402 17.0261C56.4865 21.3091 63.903 33.4464 65.8871 36.5115L62.2883 42.2723Z"
            fill="#35231A"
          />
        </g>
      </svg>
    );
  }
}

export default Knight;
