import React, { useState } from 'react';

import { Option, OptionType as RoomType } from './option/option';
import { Size } from 'context/size-context';
import classes from './option-picker.module.scss';

type Props = {
  items: RoomType[];
  size?: Size;
  onSelect?: (item: RoomType | null) => void;
};

export const OptionPicker = (props: Props) => {
  const { items, size = 'default', onSelect } = props;
  const [selected, setSelected] = useState<RoomType | null>(null);

  function handleSelect(item: RoomType | null) {
    setSelected(item);
    if (onSelect) {
      onSelect(item);
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
      <li key={i.title} className={classes.item}>
        <Option item={i} size={size} onSelect={() => handleSelect(i)} />
      </li>
    ));

  return <ul>{selected ? renderSelectedOption() : renderOptions()}</ul>;
};
