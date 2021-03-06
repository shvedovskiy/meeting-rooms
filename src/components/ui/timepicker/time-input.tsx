import React, { FormEventHandler, KeyboardEventHandler, FocusEventHandler } from 'react';
import updateInputWidth from 'update-input-width';
import cn from 'classnames';

import cls from './time-picker.module.scss';

type Props = {
  itemRef: (ref: HTMLInputElement | null, name: string) => void;
  max?: number;
  min?: number;
  name: string;
  onChange: FormEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
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
    min = 0,
    name,
    onChange,
    onKeyDown,
    onKeyUp,
    onBlur,
    showLeadingZeros = false,
    step,
    value,
  } = props;
  const hasLeadingZero = showLeadingZeros === true && value !== null && value < 10;

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = event => {
    updateInputWidth(event.target);
    onKeyUp(event);
  };

  return (
    <>
      {hasLeadingZero && <span>0</span>}
      <input
        autoComplete="off"
        className={cn(cls.input, {
          [cls['input-hasLeadingZero']]: hasLeadingZero,
        })}
        inputMode="decimal"
        max={max}
        min={min}
        name={name}
        onChange={() => {}}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={handleKeyUp}
        onInput={onChange}
        onBlur={onBlur}
        placeholder="--"
        ref={ref => {
          if (ref) {
            updateInputWidth(ref);
          }
          itemRef?.(ref, name);
        }}
        step={step}
        type="number"
        value={value === null ? '' : value}
      />
    </>
  );
};
