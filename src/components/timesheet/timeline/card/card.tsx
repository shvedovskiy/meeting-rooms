import React, { useContext } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';
import pluralize from 'pluralize-ru';

import classes from './card.module.scss';
import { Event } from '../../types';
import { IconButton } from 'components/ui/icon-button/icon-button';
import sizeContext from 'context/size-context';
import { Avatar } from 'components/ui/avatar/avatar';

type Props = {
  data: Event;
  room: string;
  onAction?: (event: Event) => void;
};

export const Card = ({ data, room, onAction }: Props) => {
  const size = useContext(sizeContext) || 'default';

  function handleClick() {
    if (onAction) {
      onAction(data);
    }
  }

  function renderInfo() {
    const { date, startTime, endTime } = data;
    const info = `${format(date, 'd MMMM', {
      locale: ruLocale,
    })}, ${startTime}–${endTime}\u00A0·\u00A0${room}`;
    return <p>{info}</p>;
  }

  function renderParticipants() {
    const items = data.participants;
    if (!items || !items.length) {
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
      <div className={classes.participants}>
        <div className={classes.iconContainer}>
          <Avatar
            avatarPath={items[0].avatarUrl}
            size={size}
            className={classes.icon}
          />
        </div>
        <p className={classes.name}>
          {items[0].login} {items.length > 1 && <span>{others}</span>}
        </p>
      </div>
    );
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
      {renderParticipants()}
    </div>
  );
};
