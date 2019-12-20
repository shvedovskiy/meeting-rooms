import React from 'react';
import cn from 'classnames';

import { CardParticipants } from './participants';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Event } from '../../types';
import { useSizeCtx, Size } from 'context/size-context';
import { format } from 'service/dates';
import cls from './card.module.scss';

type Props = {
  data: Event;
  room: string;
  onAction?: (event: Event) => void;
};

export const Card = ({ data, room, onAction }: Props) => {
  const size = useSizeCtx() ?? Size.DEFAULT;

  function renderInfo() {
    const { date, startTime, endTime } = data;
    const info = `${format(date)}, ${startTime}\u2013${endTime}\u00A0·\u00A0${room}`;
    return <p>{info}</p>;
  }

  return (
    <div className={cn(cls.card, { [cls.lg]: size === Size.LARGE })}>
      <div className={cls.header}>
        <IconButton
          icon="pen"
          ariaLabel="Редактировать встречу"
          onClick={() => onAction?.(data)}
        />
        <h1 className={cls.title}>{data.title}</h1>
      </div>
      {renderInfo()}
      <CardParticipants items={data.users} size={size} />
    </div>
  );
};
