import React, { useEffect, useRef } from 'react';

import classes from './button.module.scss';

export type ButtonKind = 'button' | 'submit' | 'reset';
export type ButtonUse = 'default' | 'primary';

export interface ButtonType {
  autoFocus?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: ButtonKind;
  use?: ButtonUse;
}

export const Button: React.FC<
  ButtonType & { children?: React.ReactNode }
> = props => {
  const buttonNode = useRef<HTMLButtonElement>(null);
  const {
    autoFocus,
    children,
    disabled,
    onClick,
    type = 'button',
    use = 'default',
  } = props;

  function focus() {
    if (buttonNode && buttonNode.current) {
      buttonNode.current.focus();
    }
  }

  useEffect(() => {
    if (autoFocus === true) {
      focus();
    }
  }, [autoFocus]);

  const buttonProps = {
    type,
    className: `${classes.btn} ${classes[use]}`,
    disabled,
    onClick,
  };

  return (
    <button ref={buttonNode} {...buttonProps}>
      {children}
    </button>
  );
};
