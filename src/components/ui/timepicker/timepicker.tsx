import React from 'react';
// @ts-ignore https://github.com/wojtekmaj/react-time-picker/issues/33
import TimePicker from 'react-time-picker';
import classNames from 'classnames';

import classes from './timepicker.module.scss';
import { Size } from 'context/size-context';

export type Props = {
  size?: Size;
  value?: string | null;
  error?: boolean;
  onChange?: (value: string) => void;
};

const TimePickerComponent = (props: Props) => {
  const { size = 'default', value, error } = props;

  // let minDate = null;
  // if (!value || value === '') {
  //   const rounded = roundDate(Date.now());
  //   minDate = format(rounded, 'H:mm', { locale: ruLocale });
  // }

  function onChange(value: string | null) {
    if (props.onChange) {
      props.onChange(value || '');
    }
  }

  return (
    <TimePicker
      clearIcon={null}
      clockIcon={null}
      className={classNames(classes.timepicker, {
        [classes.lg]: size !== 'default',
        [classes.error]: error,
      })}
      disableClock
      locale="ru-RU"
      onChange={onChange}
      value={value === null ? undefined : value}
    />
  );
};

export { TimePickerComponent as TimePicker };
