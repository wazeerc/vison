import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'url(#hand-drawn-filter)' }}
    >
      <defs>
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
};

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'url(#hand-drawn-filter)' }}
    >
      <defs>
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
};

export const TableViewIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'url(#hand-drawn-filter)' }}
    >
      <defs>
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
};

export const TreeViewIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'url(#hand-drawn-filter)' }}
    >
      <defs>
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
      <path d="M10 10v4a2 2 0 0 0 2 2h4" />
      <path d="M6 6v12" />
      <path d="M10 6h8a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-8" />
      <path d="M10 14h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4" />
    </svg>
  );
};

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'url(#hand-drawn-filter)' }}
    >
      <defs>
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        </filter>
      </defs>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
};

export const VisonLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <rect
        id="r9"
        width="512"
        height="512"
        x="0"
        y="0"
        rx="0"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      />
      <clipPath id="clip">
        <use xlinkHref="#r9" />
      </clipPath>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16"
        width="500"
        height="500"
        x="6"
        y="6"
        alignmentBaseline="middle"
        style={{ color: 'rgb(155, 135, 245)' }}
      >
        <g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          className="[transform-style:preserve-3d] animate-spin-y"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3.25 2.75 1.75 4l1.5 1.25"
          />
        </g>
        <g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          className="[transform-style:preserve-3d] animate-spin-y"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7.25 2.75 8.75 4l-1.5 1.25"
          />
        </g>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m1.75 8.5v3.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2h-.5"
        />
      </svg>
    </svg>
  );
};
