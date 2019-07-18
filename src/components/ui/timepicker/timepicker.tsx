import React from 'react';
// @ts-ignore https://github.com/wojtekmaj/react-time-picker/issues/33
import TimePicker from 'react-time-picker';
import classNames from 'classnames';
import { format } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import classes from './timepicker.module.scss';
import { Size } from 'context/size-context';
import { roundDate } from 'service/dates';

export type Props = {
  size?: Size;
  value?: string;
  error?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
};

const TimePickerComponent = (props: Props) => {
  const { required = true, size = 'default', value, error } = props;

  let minDate = null;
  if (!value) {
    const rounded = roundDate(Date.now());
    minDate = format(rounded, 'H:mm', { locale: ruLocale });
  }

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
      minTime={minDate}
      onChange={onChange}
      required={required}
      value={value}
    />
  );
};

export { TimePickerComponent as TimePicker };
