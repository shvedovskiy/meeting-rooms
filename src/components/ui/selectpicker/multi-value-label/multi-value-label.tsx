import React from 'react';
import { MultiValueGenericProps } from 'react-select/lib/components/MultiValue';

import { ItemType } from '../option/option';
import classes from './multi-value-label.module.scss';

export const MultiValueLabel = ({
  innerProps,
  data,
}: MultiValueGenericProps<ItemType>) => {
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
      <span className={classes.value}>{data.value}</span>
    </div>
  );
};
