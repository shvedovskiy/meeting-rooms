import React, {
  memo,
  useEffect,
  useRef,
  ReactChild,
  MouseEventHandler,
  ButtonHTMLAttributes,
} from 'react';
import classNames from 'classnames';

import { Size } from 'context/size-context';
import classes from './button.module.scss';
import { Override } from 'service/typings';

export type ButtonKind = 'button' | 'submit' | 'reset';
export type ButtonUse = 'default' | 'primary' | 'borderless';
export type ButtonType = Override<
  ButtonHTMLAttributes<HTMLButtonElement>,
  {
    autoFocus?: boolean;
    className?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: Size;
    type?: ButtonKind;
    use?: ButtonUse;
    danger?: boolean;
  }
>;

type Props = ButtonType & { children?: ReactChild };

export const Button = memo((props: Props) => {
  const buttonNode = useRef<HTMLButtonElement>(null!);
  const {
    autoFocus,
    children,
    className,
    disabled,
    onClick,
    size = 'default',
    type = 'button',
    use = 'default',
    danger = false,
    ...rest
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
    className: classNames(classes.btn, classes[use], className, {
      [classes.lg]: size === 'large',
      [classes.danger]: danger,
    }),
    ref: buttonNode,
    disabled,
    onClick,
    ...rest,
  };

  return <button {...buttonProps}>{children}</button>;
});
