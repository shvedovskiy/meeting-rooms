import React from 'react';
// @ts-ignore https://github.com/wojtekmaj/react-time-picker/issues/33
import TimePicker from 'react-time-picker';
import classNames from 'classnames';

import classes from './timepicker.module.scss';
import { Size } from 'context/size-context';
import { roundDate } from 'service/dates';

export type Props = {
  onChange?: (value: string | null) => void;
  required?: boolean;
  size?: Size;
  value?: Date;
};

const TimePickerComponent = (props: Props) => {
  const { required = true, size = 'default', value } = props;

  let minDate = null;
  if (!value) {
    const rounded = roundDate(Date.now());
    minDate = `${rounded.getHours()}:${rounded.getMinutes()}`;
  }

  function onChange(value: string | null) {
    if (props.onChange) {
      props.onChange(value);
    }
  }

  return (
    <TimePicker
      clearIcon={null}
      clockIcon={null}
      className={classNames(classes.timepicker, {
        [classes.lg]: size !== 'default',
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
