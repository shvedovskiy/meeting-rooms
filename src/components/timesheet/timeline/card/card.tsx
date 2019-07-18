import React, { useContext } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';
import pluralize from 'pluralize-ru';

import classes from './card.module.scss';
import { Event } from '../../types';
import { IconButton } from 'components/ui/icon-button/icon-button';
import sizeContext, { Size } from 'context/size-context';

type Props = {
  data: Event;
  room: string;
  onAction?: (event: Event) => void;
};

function avatarSizes(url: string = '', size: Size) {
  const base = size === 'default' ? 24 : 32;
  return {
    single: `${url}${base}`,
    double: `${url}${base * 2}`,
    triple: `${url}${base * 3}`,
  };
}

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

    const avatar = avatarSizes(items[0].avatarUrl, size);
    return (
      <div className={classes.participants}>
        <div className={classes.iconContainer}>
          <picture>
            <source
              srcSet={`${avatar.triple}.webp 3x, ${avatar.double}.webp 2x, ${avatar.single}.webp`}
              type="image/webp"
            />
            <img
              className={classes.icon}
              srcSet={`${avatar.triple}.png 3x, ${avatar.double}.png 2x, ${avatar.single}.png`}
              src={`${avatar.single}.png`}
              alt=""
              aria-hidden="true"
            />
          </picture>
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
