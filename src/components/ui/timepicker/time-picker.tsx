import React, {
  PureComponent,
  FocusEventHandler,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ChangeEvent,
} from 'react';
import classNames from 'classnames';

import { TimeInput } from './time-input';
import { splitTimeString } from 'service/dates';
import classes from './time-picker.module.scss';
import { Size } from 'context/size-context';

const hoursAreDifferent = (date1?: string, date2?: string) =>
  (date1 && !date2) || (!date1 && date2) || (date1 && date2 && date1 !== date2); // TODO: Compare 11:22:00 and 11:22 properly

const isValidInput = (element: Element) =>
  element.tagName === 'INPUT' &&
  (element as HTMLInputElement).type === 'number';

function findInput(
  element: Element,
  property: 'previousElementSibling' | 'nextElementSibling'
) {
  let nextElement = element;
  do {
    nextElement = nextElement[property]!;
  } while (nextElement && !isValidInput(nextElement));
  return nextElement as HTMLInputElement;
}

const focus = (element: HTMLInputElement | null) => element && element.focus();

type Props = {
  size?: Size;
  value: string | null;
  error?: boolean;
  onChange?: (value: string | null) => void;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
};

type State = {
  hour: number | null;
  minute: number | null;
  value?: string;
};

export class TimePicker extends PureComponent<Props, State> {
  private hourInput: HTMLInputElement | null = null;
  private minuteInput: HTMLInputElement | null = null;

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const nextState: Partial<State> = {};
    const nextValue = nextProps.value;
    if (nextValue !== null && hoursAreDifferent(nextValue, prevState.value)) {
      if (typeof nextValue === 'string' && nextValue.length > 0) {
        const [hour, minute] = splitTimeString(nextValue);
        nextState.hour = hour;
        nextState.minute = minute;
      } else {
        nextState.hour = null;
        nextState.minute = null;
      }
      nextState.value = nextValue;
    }
    return nextState;
  }

  state = {
    hour: null,
    minute: null,
  };

  onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      const firstInput = (event.target as HTMLDivElement).children[1];
      focus(firstInput as HTMLInputElement);
    }
  };

  onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case ':': {
        event.preventDefault();
        const input = event.target as HTMLInputElement;
        const property =
          event.key === 'ArrowLeft'
            ? 'previousElementSibling'
            : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  };

  onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    const isNumberKey = !Number.isNaN(Number.parseInt(event.key, 10));
    if (!isNumberKey) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const max = Number.parseInt(input.getAttribute('max')!, 10);

    if (Number.parseInt(input.value, 10) * 10 > max) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  };

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (name === 'hour') {
      this.setState(
        {
          hour: value.length > 0 ? Number.parseInt(value, 10) : null,
        },
        this.onChangeExternal
      );
    } else if (name === 'minute') {
      this.setState(
        {
          minute: value.length > 0 ? Number.parseInt(value, 10) : null,
        },
        this.onChangeExternal
      );
    }
  };

  onChangeNative = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { value } = event.target as HTMLInputElement;
    if (onChange) {
      onChange(value === null ? null : value);
    }
  };

  onChangeExternal = () => {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    const formElements = [this.hourInput, this.minuteInput].filter(Boolean);
    const values: { [name: string]: string } = {};

    formElements.forEach(f => {
      values[f!.name] = f!.value;
    });

    if (formElements.every(f => f!.value === '')) {
      onChange('');
    } else if (
      formElements.some(f => f!.value === '' || f!.checkValidity() === false)
    ) {
      onChange(null);
    } else {
      const value = `${values.hour.padStart(2, '0')}:${values.minute.padStart(
        2,
        '0'
      )}`;
      onChange(value);
    }
  };

  onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(event);
    }
  };

  onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }
  };

  renderHour = () => {
    const { hour } = this.state;
    return (
      <TimeInput
        key="hour"
        max={23}
        min={0}
        name="hour"
        value={hour}
        itemRef={(ref: HTMLInputElement | null) => {
          this.hourInput = ref;
        }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      />
    );
  };

  renderMinute = () => {
    const { minute } = this.state;
    return (
      <TimeInput
        key="minute"
        max={59}
        min={0}
        name="minute"
        showLeadingZeros
        value={minute}
        itemRef={(ref: HTMLInputElement | null) => {
          this.minuteInput = ref;
        }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      />
    );
  };

  render() {
    const { size = 'default', error, value = '' } = this.props;
    return (
      <div
        className={classNames(classes.timePicker, {
          [classes.lg]: size !== 'default',
          [classes.error]: error,
        })}
        onClick={this.onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        role="presentation"
      >
        <input
          className="visually-hidden"
          tabIndex={-1}
          onChange={this.onChangeNative}
          onFocus={e => e.stopPropagation()}
          step={60}
          type="time"
          value={value || ''}
        />
        {this.renderHour()}
        <span className={classes.divider}>:</span>
        {this.renderMinute()}
      </div>
    );
  }
}
