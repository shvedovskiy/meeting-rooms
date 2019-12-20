import React from 'react';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import { Avatar } from 'components/ui/avatar/avatar';
import { UserData } from 'components/timesheet/types';
import cls from './multi-value-label.module.scss';

export const MultiValueLabel = ({ innerProps, data }: MultiValueGenericProps<UserData>) => {
  const props = {
    ...innerProps,
    className: `${innerProps.className} ${cls.labelContainer}`,
  };
  return (
    <div {...props}>
      <div className={cls.iconContainer}>
        <Avatar avatarPath={data.avatarUrl} size="default" />
      </div>
      <span className={cls.value} title={data.login}>
        {data.login}
      </span>
    </div>
  );
};
