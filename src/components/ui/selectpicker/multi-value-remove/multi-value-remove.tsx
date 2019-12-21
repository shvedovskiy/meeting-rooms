import React from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

import { Icon } from 'components/ui/icon/icon';
import { UserData } from 'components/timesheet/types';
import cls from './multi-value-remove.module.scss';

export const MultiValueRemove = ({
  innerProps,
  selectProps,
}: MultiValueRemoveProps<UserData>) => {
  const props = {
    ...innerProps,
    type: 'button' as const,
    className: `${innerProps.className} ${cls.removeButton}`,
  };
  return (
    <button {...props} title="Удалить участника">
      <Icon name="close" size={selectProps.size} />
    </button>
  );
};
