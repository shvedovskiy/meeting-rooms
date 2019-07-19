import React, { FocusEvent } from 'react';
import Select from 'react-select';
import { ValueType } from 'react-select/src/types';

import { Option } from './option/option';
import { ValueContainer } from './value-container/value-container';
import { MultiValueLabel } from './multi-value-label/multi-value-label';
import { MultiValueRemove } from './multi-value-remove/multi-value-remove';
import { customStyles } from './styles';
import { Size } from 'context/size-context';
import { UserData } from 'components/timesheet/types';
import './selectpicker.module.scss';

type Props = {
  ariaLabel?: string;
  id?: string;
  items?: UserData[];
  value?: UserData[] | null;
  placeholder?: string;
  size?: Size;
  error?: boolean;
  onChange?: (values: ValueType<UserData>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

export const Selectpicker = (props: Props) => {
  const {
    items = [],
    value,
    placeholder,
    id = 'selectpicker',
    size = 'default',
    error,
    onBlur,
    onChange,
  } = props;
  const components = {
    ValueContainer,
    IndicatorSeparator: () => null,
    ClearIndicator: () => null,
    Option,
    MultiValueLabel,
    MultiValueRemove,
  };

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (onBlur) {
      onBlur(event);
    }
  }

  function handleChange(values: ValueType<UserData>) {
    if (onChange) {
      onChange(values);
    }
  }

  return (
    <div id={id}>
      <Select
        components={components}
        containerId={id}
        defaultValue={value}
        error={error}
        getOptionValue={(option: UserData) => option.login}
        hideSelectedOptions
        isMulti
        maxMenuHeight={120}
        menuPlacement="auto"
        noOptionsMessage={() => 'Ничего не найдено'}
        onBlur={handleBlur}
        onChange={handleChange}
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
