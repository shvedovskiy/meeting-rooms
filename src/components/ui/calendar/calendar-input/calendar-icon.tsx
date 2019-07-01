import React, { memo } from 'react';

import { Size } from 'context/size-context';

type Props = {
  mainClassName?: string;
  className?: string;
  size?: Size;
};

export const CalendarIcon = memo(
  ({ mainClassName, className, size = 'default' }: Props) => (
    <svg
      className={mainClassName}
      width={size === 'default' ? 12 : 14}
      height={size === 'default' ? 12 : 14}
      // viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      version="1"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M-5-4h24v24H-5z" />
        <path
          className={className}
          fillRule="nonzero"
          d="M1 5v8h12V5H1zm11-3h2v12H0V2h2V0h2v2h6V0h2v2zM2 9v2h2V9H2zm0-3v2h2V6H2zm3 0v2h2V6H5z"
        />
      </g>
    </svg>
  )
);
