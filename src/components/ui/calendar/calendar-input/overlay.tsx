import React, { ReactNode } from 'react';
import cn from 'classnames';
import { useSizeCtx, Size } from 'context/size-context';

import { CustomInputClassNames } from './calendar-input.module.scss';

type Props = {
  selectedDay?: Date;
  month: Date;
  input: ReactNode;
  children: ReactNode;
  classNames: CustomInputClassNames;
};

export function OverlayComponent({
  input,
  selectedDay,
  month,
  children,
  classNames,
  ...props
}: Props) {
  const size = useSizeCtx() ?? Size.DEFAULT;

  return (
    <div className={classNames.overlayWrapper} {...props}>
      <div className={cn(classNames.overlay, { [classNames.lg]: size === Size.LARGE })}>
        {children}
      </div>
    </div>
  );
}
