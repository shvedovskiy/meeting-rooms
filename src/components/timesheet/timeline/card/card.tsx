import React, { useContext } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';
import pluralize from 'pluralize-ru';

import classes from './card.module.scss';
import { Event } from '../../types';
import { IconButton } from 'components/ui/icon-button/icon-button';
import sizeContext from 'context/size-context';

type Props = {
  data: Event;
  onAction?: (event: Event) => void;
};

export const Card = ({ data, onAction }: Props) => {
  const size = useContext(sizeContext) || 'default';

  function handleClick() {
    if (onAction) {
      onAction(data);
    }
  }

  function renderInfo() {
    const date = format(data.dateStart, 'd MMMM', { locale: ruLocale });
    const startTime = format(data.dateStart, 'p', { locale: ruLocale });
    const endTime = format(data.dateEnd, 'p', { locale: ruLocale });
    const info = `${date}, ${startTime}–${endTime}\u00A0·\u00A0${data.roomTitle}`;
    return <p className={classes.info}>{info}</p>;
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
          <img
            className={classes.icon}
            src={items[0].avatarUrl}
            alt=""
            aria-hidden="true"
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
        <IconButton icon="pen" onClick={handleClick} />
        <h1 className={classes.title}>{data.title}</h1>
      </div>
      {renderInfo()}
      {renderParticipants()}
    </div>
  );
};
