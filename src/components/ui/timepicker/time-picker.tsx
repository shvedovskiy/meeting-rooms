import React, {
  PureComponent,
  FocusEventHandler,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import cn from 'classnames';

import { TimeInput } from './time-input';
import { splitTimeString } from 'service/dates';
import { Size } from 'context/size-context';
import cls from './time-picker.module.scss';

const hoursAreDifferent = (date1?: string, date2?: string) =>
  (date1 && !date2) || (!date1 && date2) || (date1 && date2 && date1 !== date2); // TODO: Compare 11:22:00 and 11:22 properly

const isValidInput = (element: Element) =>
  element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'number';

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

const focus = (element: HTMLInputElement | null) => element?.focus();

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
  state = {
    hour: null,
    minute: null,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const nextState: Partial<State> = {};
    const nextValue = nextProps.value;
    if (nextValue !== null && hoursAreDifferent(nextValue, prevState.value)) {
      if (typeof nextValue === 'string' && nextValue.length > 0) {
        const [hour, minute] = splitTimeString(nextValue);
        nextState.hour = Number.isNaN(hour) ? null : hour;
        nextState.minute = Number.isNaN(minute) ? null : minute;
      } else {
        nextState.hour = null;
        nextState.minute = null;
      }
      nextState.value = nextValue;
    }
    return nextState;
  }

  onClick: MouseEventHandler<HTMLDivElement> = event => {
    if (event.target === event.currentTarget) {
      const firstInput = (event.target as HTMLDivElement).children[1];
      focus(firstInput as HTMLInputElement);
    }
  };

  onBlur: FocusEventHandler<HTMLInputElement> = event => {
    if (this.props.onBlur) {
      event.persist();
      setTimeout(() => {
        const inputs = [this.hourInput, this.minuteInput];
        if (inputs.every(i => document.activeElement !== i)) {
          this.props.onBlur!(event);
        }
      }, 0);
    }
  };

  onKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
    switch (event.key) {
      case ':': {
        event.preventDefault();
        const nextInput = findInput(event.target as HTMLInputElement, 'nextElementSibling');
        focus(nextInput);
        break;
      }
      default:
        break;
    }
  };

  onKeyUp: KeyboardEventHandler<HTMLInputElement> = event => {
    if (!Number.isInteger(Number(event.key))) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const max = Number.parseInt(input.getAttribute('max')!, 10);

    if (Number.parseInt(input.value, 10) * 10 > max || input.value.length >= 2) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  };

  onChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { name, value } = event.target;
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

  onChangeExternal = () => {
    if (!this.props.onChange) {
      return;
    }
    const formElements = [this.hourInput, this.minuteInput];
    const values: { [name: string]: string } = {};

    formElements.forEach(f => {
      values[f!.name] = f!.value;
    });

    let changeValue: string | null = null;
    if (formElements.every(el => el?.checkValidity() === true && el?.value.length <= 2)) {
      if (formElements.every(el => el?.value === '')) {
        changeValue = '';
      } else {
        changeValue = `${values.hour ? values.hour.padStart(2, '0') : ''}:${
          values.minute ? values.minute.padStart(2, '0') : ''
        }`;
      }
    }
    this.props.onChange(changeValue);
  };

  renderHour = () => {
    const { hour } = this.state;
    return (
      <TimeInput
        key="hour"
        max={23}
        name="hour"
        value={hour}
        itemRef={(ref: HTMLInputElement | null) => {
          this.hourInput = ref;
        }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
      />
    );
  };

  renderMinute = () => {
    const { minute } = this.state;
    return (
      <TimeInput
        key="minute"
        max={59}
        name="minute"
        step={15}
        showLeadingZeros
        value={minute}
        itemRef={(ref: HTMLInputElement | null) => {
          this.minuteInput = ref;
        }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
      />
    );
  };

  render() {
    const { size = Size.DEFAULT, error } = this.props;
    return (
      <div
        className={cn(cls.timePicker, {
          [cls.lg]: size !== Size.DEFAULT,
          [cls.error]: error,
        })}
        onClick={this.onClick}
        onFocus={this.props.onFocus}
        role="presentation"
      >
        {this.renderHour()}
        <span className={cls.divider}>:</span>
        {this.renderMinute()}
      </div>
    );
  }
}
