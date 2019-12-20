import React, {
  forwardRef,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';
import cn from 'classnames';

import { Size } from 'context/size-context';
import { MouseEventHandler } from 'react-select';
import cls from './input.module.scss';

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
    size = Size.DEFAULT,
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
    className: cn(cls.input, {
      [cls.lg]: size === Size.LARGE,
      [cls.error]: error,
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
        <button type="button" className={cls.sideIcon} onClick={onSideIconClick}>
          {iconContent}
        </button>
      );
    }
    return <span className={cls.sideIcon}>{iconContent}</span>;
  }

  return (
    <span className={cls.wrapper}>
      <input {...inputProps} />
      {renderSideIcon()}
    </span>
  );
});
