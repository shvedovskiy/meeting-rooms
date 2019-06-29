import React from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

import { ItemType } from '../option/option';
import { ReactComponent as Close } from './close.svg';
import classes from './multi-value-remove.module.scss';

export const MultiValueRemove = ({
  innerProps,
}: MultiValueRemoveProps<ItemType>) => {
  const props = {
    ...innerProps,
    className: `${innerProps.className} ${classes.removeButton}`,
  };
  return (
    <button {...props}>
      <Close />
    </button>
  );
};
