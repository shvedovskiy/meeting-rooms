import React from 'react';
import classNames from 'classnames';

import { CloseIcon } from 'components/ui/close-icon/close-icon';
import classes from './option.module.scss';
import { Size } from 'context/size-context';

export type OptionType = {
  startTime: string;
  endTime: string;
  title: string;
  floor: number;
};

type Props = {
  item: OptionType;
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
  const className = classNames(classes.option, {
    [classes.selected]: selected,
    [classes.lg]: size === 'large',
  });

  return (
    <button className={className} onClick={selected ? onDeselect : onSelect}>
      <span className={classes.time}>
        {item.startTime}&mdash;{item.endTime}
      </span>
      <span className={classes.title}>
        {item.title}&nbsp;·&nbsp;{item.floor} этаж
      </span>

      {selected && (
        <CloseIcon
          mainClassName={classes.icon}
          className={classes.iconSymbol}
          size={size}
        />
      )}
    </button>
  );
};
