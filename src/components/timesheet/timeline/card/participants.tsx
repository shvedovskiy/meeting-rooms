import React from 'react';
import pluralize from 'pluralize-ru';

import { UserData } from 'components/timesheet/types';
import { Avatar } from 'components/ui/avatar/avatar';
import { Size } from 'context/size-context';
import cls from './card.module.scss';

type Props = {
  items?: UserData[];
  size?: Size;
};

export const CardParticipants = ({ items = [], size = Size.DEFAULT }: Props) => {
  if (!items.length) {
    return null;
  }
  const others = `и ${items.length - 1}\u00A0${pluralize(
    items.length - 1,
    '',
    'человек',
    'человека',
    'человек'
  )}`;

  return (
    <div className={cls.participants}>
      <div className={cls.iconContainer}>
        <Avatar avatarPath={items[0].avatarUrl} size={size} />
      </div>
      <p className={cls.name}>
        {items[0].login} {items.length > 1 && <span>{others}</span>}
      </p>
    </div>
  );
};
