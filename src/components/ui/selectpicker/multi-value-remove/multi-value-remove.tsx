import React from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

import { ItemType } from '../option/option';
import classes from './multi-value-remove.module.scss';
import { Icon } from 'components/ui/icon/icon';

export const MultiValueRemove = ({
  innerProps,
}: MultiValueRemoveProps<ItemType>) => {
  const props = {
    ...innerProps,
    className: `${innerProps.className} ${classes.removeButton}`,
  };
  return (
    <button {...props}>
      <Icon name="close" className={classes.icon} />
    </button>
  );
};
