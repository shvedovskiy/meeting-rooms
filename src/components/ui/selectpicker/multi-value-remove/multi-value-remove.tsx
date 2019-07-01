import React from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

import { ItemType } from '../option/option';
import classes from './multi-value-remove.module.scss';
import { CloseIcon } from 'components/ui/close-icon/close-icon';

export const MultiValueRemove = ({
  innerProps,
}: MultiValueRemoveProps<ItemType>) => {
  const props = {
    ...innerProps,
    className: `${innerProps.className} ${classes.removeButton}`,
  };
  return (
    <button {...props}>
      <CloseIcon size={10} className={classes.icon} />
    </button>
  );
};
