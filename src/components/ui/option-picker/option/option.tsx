import React from 'react';
import cn from 'classnames';

import { Icon } from 'components/ui/icon/icon';
import classes from './option.module.scss';
import { Size } from 'context/size-context';
import { RoomCard } from 'components/timesheet/types';

type Props = {
  item?: RoomCard;
  size?: Size;
  selected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
};

export const Option = (props: Props) => {
  const {
    item,
    size = 'default',
    selected = false,
    onSelect,
    onDeselect,
  } = props;
  const className = cn(classes.option, {
    [classes.selected]: selected,
    [classes.lg]: size === 'large',
    [classes.inactive]: !item,
  });

  if (!item) {
    return (
      <div className={className}>
        <span className={classes.title}>Нет комнат</span>
      </div>
    );
  }
  return (
    <button
      className={className}
      onClick={selected ? onDeselect : onSelect}
      title={
        selected
          ? 'Отменить выбор'
          : `${item.startTime} — ${item.endTime}, ${item.title} · ${item.floor} этаж`
      }
    >
      <span className={classes.time}>
        {item.startTime}&ndash;{item.endTime}
      </span>
      <span className={classes.title}>
        {item.title}&nbsp;·&nbsp;{item.floor} этаж
      </span>

      {selected && (
        <Icon
          name="close"
          className={classes.icon}
          size={size}
          viewBox="0 0 10 10"
        />
      )}
    </button>
  );
};
