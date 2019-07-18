import React, {
  forwardRef,
  ReactNode,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import classNames from 'classnames';

import { Size } from 'context/size-context';
import classes from './input.module.scss';

type Props = {
  value?: string;
  size?: Size;
  sideIcon?: ReactNode | (() => ReactNode);
  error?: boolean;
  onSideIconClick?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
    onClick(event: MouseEvent<HTMLInputElement>) {
      if (onClick) {
        onClick(event);
      }
    },
    onChange(event: ChangeEvent<HTMLInputElement>) {
      if (onChange) {
        onChange(event);
      }
    },
    onFocus(event: FocusEvent<HTMLInputElement>) {
      if (onFocus) {
        onFocus(event);
      }
    },
    onBlur(event: FocusEvent<HTMLInputElement>) {
      if (onBlur) {
        onBlur(event);
      }
    },
    onKeyUp(event: KeyboardEvent<HTMLInputElement>) {
      if (onKeyUp) {
        onKeyUp(event);
      }
    },
  };

  function renderSideIcon() {
    if (!sideIcon) {
      return null;
    }
    let iconContent = sideIcon instanceof Function ? sideIcon() : sideIcon;
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
