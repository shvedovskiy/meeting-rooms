import React, { useState, useEffect } from 'react';

import { Option } from './option/option';
import { RoomCard } from 'components/timesheet/types';
import { Size } from 'context/size-context';
import cls from './option-picker.module.scss';

type Props = {
  id?: string;
  size?: Size;
  items?: RoomCard[];
  value?: RoomCard | null;
  onChange?: (item: RoomCard | null) => void;
};

export const OptionPicker = (props: Props) => {
  const { id, items = [], size = Size.DEFAULT, value = null, onChange } = props;
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
    <li className={cls.item}>
      <Option selected item={selected!} size={size} onDeselect={() => handleSelect(null)} />
    </li>
  );
  const renderOptions = () => {
    if (!items.length) {
      return (
        <li key="blank" className={cls.item}>
          <Option size={size} />
        </li>
      );
    }
    return items.map(i => (
      <li key={i.id} className={cls.item}>
        <Option item={i} size={size} onSelect={() => handleSelect(i)} />
      </li>
    ));
  };

  return <ul id={id}>{selected ? renderSelectedOption() : renderOptions()}</ul>;
};
