import React, { useEffect, useRef, ReactChild, MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Size } from 'service/sizes';
import classes from './button.module.scss';

export type ButtonKind = 'button' | 'submit' | 'reset';
export type ButtonUse = 'default' | 'primary';
export type ButtonType = {
  autoFocus?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: Size;
  type?: ButtonKind;
  use?: ButtonUse;
};

type Props = ButtonType & { children?: ReactChild };

export const Button = (props: Props) => {
  const buttonNode = useRef<HTMLButtonElement>(null!);
  const {
    autoFocus,
    children,
    disabled,
    onClick,
    size = 'default',
    type = 'button',
    use = 'default',
  } = props;

  function focus() {
    buttonNode.current.focus();
  }

  useEffect(() => {
    if (autoFocus === true) {
      focus();
    }
  }, [autoFocus]);

  const buttonProps = {
    type,
    className: classNames(classes.btn, classes[use], {
      [classes.lg]: size === 'large',
    }),
    disabled,
    onClick,
  };

  return (
    <button ref={buttonNode} {...buttonProps}>
      {children}
    </button>
  );
};
