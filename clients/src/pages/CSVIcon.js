import React from 'react';

function CsvIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || "32"}
      height={props.height || "32"}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21h-14c-1.104 0-2-.896-2-2v-12c0-1.104.896-2 2-2h14c1.104 0 2 .896 2 2v12c0 1.104-.896 2-2 2z" />
      <path d="M16 2v4a1 1 0 0 0 1 1h4" />
      <path d="M17 7l-3 3-3-3" />
      <path d="M14 10v5" />
    </svg>
  );
}

export default CsvIcon;
