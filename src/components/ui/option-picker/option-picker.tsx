import React, { useState, useEffect } from 'react';

import { Option } from './option/option';
import { Size } from 'context/size-context';
import classes from './option-picker.module.scss';
import { RoomCard } from 'components/timesheet/types';

type Props = {
  id?: string;
  size?: Size;
  items?: RoomCard[];
  value?: RoomCard | null;
  onChange?: (item: RoomCard | null) => void;
};

export const OptionPicker = (props: Props) => {
  const { id, items = [], size = 'default', value = null, onChange } = props;
  const [selected, setSelected] = useState<RoomCard | null>(value);

  useEffect(() => {
    if (!value) {
      setSelected(null);
    }
  }, [value]);

  function handleSelect(item: RoomCard | null) {
    setSelected(item);
    onChange?.(item);
  }

  const renderSelectedOption = () => (
    <li className={classes.item}>
      <Option selected item={selected!} size={size} onDeselect={() => handleSelect(null)} />
    </li>
  );
  const renderOptions = () => {
    if (!items.length) {
      return (
        <li key="blank" className={classes.item}>
          <Option size={size} />
        </li>
      );
    }
    return items.map(i => (
      <li key={i.id} className={classes.item}>
        <Option item={i} size={size} onSelect={() => handleSelect(i)} />
      </li>
    ));
  };

  return <ul id={id}>{selected ? renderSelectedOption() : renderOptions()}</ul>;
};
