import React from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

import classes from './multi-value-remove.module.scss';
import { Icon } from 'components/ui/icon/icon';
import { UserData } from 'components/timesheet/types';

export const MultiValueRemove = ({ innerProps }: MultiValueRemoveProps<UserData>) => {
  const props = {
    ...innerProps,
    type: 'button' as const,
    className: `${innerProps.className} ${classes.removeButton}`,
  };
  return (
    <button {...props} title="Удалить участника">
      <Icon name="close" />
    </button>
  );
};
