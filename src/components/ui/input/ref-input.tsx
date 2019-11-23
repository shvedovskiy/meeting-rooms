import React, {
  forwardRef,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';
import classNames from 'classnames';

import { Size } from 'context/size-context';
import classes from './input.module.scss';
import { MouseEventHandler } from 'react-select';

type Props = {
  value?: string;
  size?: Size;
  sideIcon?: ReactNode | (() => ReactNode);
  error?: boolean;
  onSideIconClick?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
};

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    size = 'default',
    sideIcon,
    error,
    onSideIconClick,
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyUp,
    ...rest
  } = props;

  const inputProps = {
    ...rest,
    type: 'text',
    ref,
    className: classNames(classes.input, {
      [classes.lg]: size === 'large',
      [classes.error]: error,
    }),
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyUp,
  };

  function renderSideIcon() {
    if (!sideIcon) {
      return null;
    }
    const iconContent = sideIcon instanceof Function ? sideIcon() : sideIcon;
    if (onSideIconClick) {
      return (
        <button className={classes.sideIcon} onClick={onSideIconClick}>
          {iconContent}
        </button>
      );
    }
    return <span className={classes.sideIcon}>{iconContent}</span>;
  }

  return (
    <span className={classes.wrapper}>
      <input {...inputProps} />
      {renderSideIcon()}
    </span>
  );
});
