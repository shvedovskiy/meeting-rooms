import React from 'react';
import cn from 'classnames';

import { CardParticipants } from './participants';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Event } from '../../types';
import { useSizeCtx } from 'context/size-context';
import { format } from 'service/dates';
import classes from './card.module.scss';

type Props = {
  data: Event;
  room: string;
  onAction?: (event: Event) => void;
};

export const Card = ({ data, room, onAction }: Props) => {
  const size = useSizeCtx() ?? 'default';

  function renderInfo() {
    const { date, startTime, endTime } = data;
    const info = `${format(date)}, ${startTime}\u2013${endTime}\u00A0·\u00A0${room}`;
    return <p>{info}</p>;
  }

  return (
    <div
      className={cn(classes.card, {
        [classes.lg]: size === 'large',
      })}
    >
      <div className={classes.header}>
        <IconButton
          icon="pen"
          ariaLabel="Редактировать встречу"
          onClick={() => onAction?.(data)}
        />
        <h1 className={classes.title}>{data.title}</h1>
      </div>
      {renderInfo()}
      <CardParticipants items={data.users} size={size} />
    </div>
  );
};
