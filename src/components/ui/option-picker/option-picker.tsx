import React, { useState } from 'react';

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

  function handleSelect(item: RoomCard | null) {
    setSelected(item);
    if (onChange) {
      onChange(item);
    }
  }

  const renderSelectedOption = () => (
    <li className={classes.item}>
      <Option
        selected
        item={selected!}
        size={size}
        onDeselect={() => handleSelect(null)}
      />
    </li>
  );
  const renderOptions = () =>
    items.map(i => (
      <li key={i.id} className={classes.item}>
        <Option item={i} size={size} onSelect={() => handleSelect(i)} />
      </li>
    ));

  return <ul id={id}>{selected ? renderSelectedOption() : renderOptions()}</ul>;
};
