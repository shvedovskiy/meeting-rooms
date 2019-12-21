import React from 'react';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';
import cn from 'classnames';

import { Avatar } from 'components/ui/avatar/avatar';
import { UserData } from 'components/timesheet/types';
import { Size } from 'context/size-context';
import cls from './multi-value-label.module.scss';

export const MultiValueLabel = ({
  innerProps,
  data,
  selectProps,
}: MultiValueGenericProps<UserData>) => {
  const props = {
    ...innerProps,
    className: cn(innerProps.className, cls.labelContainer, {
      [cls.lg]: selectProps.size === Size.LARGE,
    }),
  };
  return (
    <div {...props}>
      <div className={cls.iconContainer}>
        <Avatar avatarPath={data.avatarUrl} size={selectProps.size ?? Size.DEFAULT} />
      </div>
      <span className={cls.value} title={data.login}>
        {data.login}
      </span>
    </div>
  );
};
