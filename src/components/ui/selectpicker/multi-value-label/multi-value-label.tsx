import React from 'react';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import classes from './multi-value-label.module.scss';
import { UserData } from 'components/timesheet/types';

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
        <img
          className={classes.icon}
          src={data.avatarUrl}
          alt=""
          aria-hidden="true"
        />
      </div>
      <span className={classes.value}>{data.login}</span>
    </div>
  );
};
