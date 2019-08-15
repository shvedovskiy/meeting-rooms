import React, {
  FormEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import classNames from 'classnames';
import updateInputWidth from 'update-input-width';

import classes from './time-picker.module.scss';

type Props = {
  itemRef: (ref: HTMLInputElement | null, name: string) => void;
  max: number;
  min: number;
  name: string;
  onChange?: FormEventHandler;
  onKeyDown?: KeyboardEventHandler;
  onKeyUp?: KeyboardEventHandler;
  showLeadingZeros?: boolean;
  step?: number;
  value: number | null;
};

function select(element?: HTMLInputElement) {
  if (!element) {
    return;
  }
  requestAnimationFrame(() => element.select());
}

export const TimeInput = (props: Props) => {
  const {
    itemRef,
    max,
    min,
    name,
    onChange,
    onKeyDown,
    onKeyUp,
    showLeadingZeros = false,
    step,
    value,
  } = props;
  const hasLeadingZero =
    showLeadingZeros === true && value !== null && value < 10;

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    updateInputWidth(event.target);
    if (onKeyUp) {
      onKeyUp(event);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <>
      {hasLeadingZero && <span>0</span>}
      <input
        autoComplete="off"
        className={classNames(classes.input, {
          [classes['input--hasLeadingZero']]: hasLeadingZero,
        })}
        max={max}
        min={min}
        name={name}
        onChange={handleChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={handleKeyUp}
        ref={ref => {
          if (ref) {
            updateInputWidth(ref);
          }
          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        step={step}
        type="number"
        placeholder="--"
        value={value || ''}
      />
    </>
  );
};
