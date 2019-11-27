import React, { ReactNode } from 'react';
import cn from 'classnames';
import { useSizeCtx } from 'context/size-context';

import { CustomInputClassNames } from './calendar-input.module.scss';

type Props = {
  children: ReactNode;
  classNames: CustomInputClassNames;
};

export function OverlayComponent({ children, classNames, ...props }: Props) {
  const size = useSizeCtx();
  return (
    <div className={classNames.overlayWrapper} {...props}>
      <div
        className={cn(classNames.overlay, {
          [classNames.lg]: size === 'large',
        })}
      >
        {children}
      </div>
    </div>
  );
}
