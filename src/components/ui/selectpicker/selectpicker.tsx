import React from 'react';
import Select from 'react-select';

import { Option, ItemType } from './option/option';
import { ValueContainer } from './value-container/value-container';
import { MultiValueLabel } from './multi-value-label/multi-value-label';
import { MultiValueRemove } from './multi-value-remove/multi-value-remove';
import { customStyles } from './styles';
import classes from './selectpicker.module.scss';
import { Size } from 'service/sizes';

type Props = {
  ariaLabel?: string;
  id?: string;
  items?: ItemType[];
  placeholder?: string;
  size?: Size;
};

export const Selectpicker = (props: Props) => {
  const {
    items = [],
    placeholder,
    id = 'selectpicker',
    size = 'default',
  } = props;
  const components = {
    ValueContainer,
    IndicatorSeparator: () => null,
    ClearIndicator: () => null,
    Option,
    MultiValueLabel,
    MultiValueRemove,
  };

  return (
    <div id={id}>
      <Select
        components={components}
        containerId={id}
        className={classes.select}
        hideSelectedOptions
        isMulti
        maxMenuHeight={120}
        menuPlacement="auto"
        noOptionsMessage={() => 'Ничего не найдено'}
        openMenuOnFocus
        options={items}
        placeholder={placeholder}
        size={size}
        styles={customStyles}
        tabSelectsValue={false}
      />
    </div>
  );
};
