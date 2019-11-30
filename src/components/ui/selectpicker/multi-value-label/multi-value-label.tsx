import React from 'react';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import classes from './multi-value-label.module.scss';
import { UserData } from 'components/timesheet/types';
import { Avatar } from 'components/ui/avatar/avatar';

export const MultiValueLabel = ({
  innerProps,
  data,
}: MultiValueGenericProps<UserData>) => {
  const props = {
    ...innerProps,
    className: `${innerProps.className} ${classes.labelContainer}`,
  };
  return (
    <div {...props}>
      <div className={classes.iconContainer}>
        <Avatar avatarPath={data.avatarUrl} size="default" />
      </div>
      <span className={classes.value} title={data.login}>
        {data.login}
      </span>
    </div>
  );
};
