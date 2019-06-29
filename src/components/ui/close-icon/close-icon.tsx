import React, { memo } from 'react';

import { Size } from 'context/size-context';

type Props = {
  mainClassName?: string;
  className?: string;
  size?: Size;
};

export const CloseIcon = memo(
  ({ mainClassName, className, size = 'default' }: Props) => (
    <svg
      className={mainClassName}
      width={size === 'default' ? 12 : 14}
      height={size === 'default' ? 12 : 14}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <path d="M-3-3h16v16H-3z" />
        <path
          className={className}
          d="M5.02 3.621L2.193.793A1 1 0 1 0 .778 2.207l2.829 2.829L.778 7.864a1 1 0 1 0 1.414 1.414L5.021 6.45l2.828 2.828a1 1 0 0 0 1.414-1.414L6.435 5.036l2.828-2.829A1 1 0 1 0 7.85.793L5.021 3.62z"
        />
      </g>
    </svg>
  )
);
