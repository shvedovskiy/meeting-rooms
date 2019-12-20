import React from 'react';
import cn from 'classnames';

import { Icon } from 'components/ui/icon/icon';
import { RoomCard } from 'components/timesheet/types';
import { Size } from 'context/size-context';
import cls from './option.module.scss';

type Props = {
  item?: RoomCard;
  size?: Size;
  selected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
};

export const Option = (props: Props) => {
  const { item, size = Size.DEFAULT, selected = false, onSelect, onDeselect } = props;
  const className = cn(cls.option, {
    [cls.selected]: selected,
    [cls.lg]: size === Size.LARGE,
    [cls.inactive]: !item,
  });

  if (!item) {
    return (
      <div className={className}>
        <span className={cls.title}>Нет комнат</span>
      </div>
    );
  }
  return (
    <button
      className={className}
      type="button"
      onClick={selected ? onDeselect : onSelect}
      title={
        selected
          ? 'Отменить выбор'
          : `${item.startTime} — ${item.endTime}, ${item.title} · ${item.floor} этаж`
      }
    >
      <span className={cls.time}>
        {item.startTime}&ndash;{item.endTime}
      </span>
      <span className={cls.title}>
        {item.title}&nbsp;·&nbsp;{item.floor} этаж
      </span>

      {selected && <Icon name="close" className={cls.icon} size={size} />}
    </button>
  );
};
