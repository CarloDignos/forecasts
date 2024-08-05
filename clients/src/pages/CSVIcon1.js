import React from 'react';

const CSVIcon = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.25 12.75H12V15.75H5.25V12.75ZM5.25 17.25H12V20.25H5.25V17.25ZM5.25 10.5H15V8.25H5.25V10.5ZM18.75 12.75H21V5.25H18.75V12.75ZM16.5 2.25H3.75C2.625 2.25 1.725 3.15 1.725 4.275V19.725C1.725 20.85 2.625 21.75 3.75 21.75H16.5C17.625 21.75 18.525 20.85 18.525 19.725V4.275C18.525 3.15 17.625 2.25 16.5 2.25ZM5.25 6.75H12V3.75H5.25V6.75ZM15.75 20.25V17.25H18.75V4.25H3.75V17.25H6.75V20.25H15.75Z"
      fill={color}
    />
  </svg>
);

export default CSVIcon;
