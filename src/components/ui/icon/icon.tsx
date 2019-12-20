import React, { memo } from 'react';

import { Size } from 'context/size-context';

export type IconType = 'calendar' | 'close' | 'chevron' | 'pen';
type Props = {
  name: IconType;
  size?: Size;
  className?: string;
};

const getIcon = (size: number, { name, className }: Partial<Props>) => {
  const commonProps = {
    width: size,
    height: size,
    className,
    role: 'img',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };
  switch (name) {
    case 'calendar':
      return (
        <svg {...commonProps} viewBox="0 0 14 14">
          <g fill="none">
            <path
              fill="currentColor"
              d="M1 5v8h12V5H1zm11-3h2v12H0V2h2V0h2v2h6V0h2v2zM2 9v2h2V9H2zm0-3v2h2V6H2zm3 0v2h2V6H5z"
            />
          </g>
        </svg>
      );
    case 'close':
      return (
        <svg {...commonProps} viewBox="0 0 10 10">
          <g fill="none">
            <path
              fill="currentColor"
              d="M5.02 3.621L2.193.793A1 1 0 1 0 .778 2.207l2.829 2.829L.778 7.864a1 1 0 1 0 1.414 1.414L5.021 6.45l2.828 2.828a1 1 0 0 0 1.414-1.414L6.435 5.036l2.828-2.829A1 1 0 1 0 7.85.793L5.021 3.62z"
            />
          </g>
        </svg>
      );
    case 'chevron':
      return (
        <svg {...commonProps} viewBox="0 -1 11 15">
          <g fill="none">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.45"
              d="M7.66 12.31L2 6.66 7.66 1"
            />
          </g>
        </svg>
      );
    case 'pen':
      return (
        <svg {...commonProps} viewBox="-1 -1 14 14">
          <g fill="none">
            <path
              fill="currentColor"
              d="M11.8 2.7a.66.66 0 0 0 0-.95L10.26.2a.66.66 0 0 0-.94 0L8.08 1.41l2.5 2.5L11.8 2.7zM0 9.5V12h2.5l7.37-7.38-2.5-2.5L0 9.5z"
            />
          </g>
        </svg>
      );
    default:
      return <path />;
  }
};

export const Icon = memo(({ size = Size.DEFAULT, ...rest }: Props) => {
  const svgSize = size === Size.DEFAULT ? 10 : 12;
  return getIcon(svgSize, { ...rest });
});
