import React from 'react';
import classNames from 'classnames';

import classes from './card.module.scss';
import { Event } from '../../types';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { useSizeCtx } from 'context/size-context';
import { CardParticipants } from './participants';
import { format } from 'service/dates';

type Props = {
  data: Event;
  room: string;
  onAction?: (event: Event) => void;
};

export const Card = ({ data, room, onAction }: Props) => {
  const size = useSizeCtx() || 'default';

  function handleClick() {
    if (onAction) {
      onAction(data);
    }
  }

  function renderInfo() {
    const { date, startTime, endTime } = data;
    const info = `${format(
      date
    )}, ${startTime}\u2013${endTime}\u00A0·\u00A0${room}`;
    return <p>{info}</p>;
  }

  return (
    <div
      className={classNames(classes.cardContainer, {
        [classes.lg]: size === 'large',
      })}
    >
      <div className={classes.header}>
        <IconButton
          icon="pen"
          ariaLabel="Редактировать встречу"
          onClick={handleClick}
        />
        <h1 className={classes.title}>{data.title}</h1>
      </div>
      {renderInfo()}
      <CardParticipants items={data.users} size={size} />
    </div>
  );
};
