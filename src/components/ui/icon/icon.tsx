import React, { memo, CSSProperties } from 'react';
import { Size } from 'context/size-context';

export type IconType = 'calendar' | 'close' | 'chevron' | 'pen';
type Props = {
  name: IconType;
  size?: Size;
  fill?: string;
  className?: string;
  style?: CSSProperties;
  viewBox?: string;
};

const getIconPath = (name: string, props: Partial<Props>) => {
  switch (name) {
    case 'calendar':
      return (
        <g fill="none" fillRule="evenodd">
          <path d="M-5-4h24v24H-5z" />
          <path
            {...props}
            fillRule="nonzero"
            d="M1 5v8h12V5H1zm11-3h2v12H0V2h2V0h2v2h6V0h2v2zM2 9v2h2V9H2zm0-3v2h2V6H2zm3 0v2h2V6H5z"
          />
        </g>
      );
    case 'close':
      return (
        <g fill="none" fillRule="evenodd">
          <path d="M-3-3h16v16H-3z" />
          <path
            {...props}
            d="M5.02 3.621L2.193.793A1 1 0 1 0 .778 2.207l2.829 2.829L.778 7.864a1 1 0 1 0 1.414 1.414L5.021 6.45l2.828 2.828a1 1 0 0 0 1.414-1.414L6.435 5.036l2.828-2.829A1 1 0 1 0 7.85.793L5.021 3.62z"
          />
        </g>
      );
    case 'chevron':
      const { fill, ...rest } = props;
      return (
        <g fill="none" fillRule="evenodd">
          <path d="M-6-5h24v24H-6z" />
          <path
            {...rest}
            stroke={fill}
            strokeLinecap="round"
            strokeWidth="2.45"
            d="M7.66 12.31L2 6.66 7.66 1"
          />
        </g>
      );
    case 'pen':
      return (
        <g fill="none" fillRule="evenodd">
          <path d="M-6-6h24v24H-6z" />
          <path
            {...props}
            fillRule="nonzero"
            d="M11.8 2.7a.66.66 0 0 0 0-.95L10.26.2a.66.66 0 0 0-.94 0L8.08 1.41l2.5 2.5L11.8 2.7zM0 9.5V12h2.5l7.37-7.38-2.5-2.5L0 9.5z"
          />
        </g>
      );
    default:
      return <path />;
  }
};

export const Icon = memo((props: Props) => {
  const {
    name,
    size = 'default',
    fill = '#000000',
    className,
    style = {},
    viewBox: vb,
  } = props;

  const svgSize = size === 'default' ? 10 : 12;
  let viewBox = vb;
  if (name === 'pen') {
    viewBox = '0 0 12 12';
  } else if (name === 'chevron') {
    viewBox = '-1 0 14 14';
  } else if (name === 'calendar') {
    viewBox = '0 0 14 14';
  }

  return (
    <svg
      width={svgSize}
      height={svgSize}
      className={className}
      style={style}
      viewBox={viewBox}
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getIconPath(name, { fill })}
    </svg>
  );
});
