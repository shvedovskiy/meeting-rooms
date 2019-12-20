import React, {
  memo,
  useEffect,
  useRef,
  ReactChild,
  MouseEventHandler,
  ButtonHTMLAttributes,
  forwardRef,
  useImperativeHandle,
} from 'react';
import cn from 'classnames';

import { Size } from 'context/size-context';
import { Override } from 'service/typings';
import cls from './button.module.scss';

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

export const Button = memo(
  forwardRef<HTMLButtonElement | null, Props>((props, ref) => {
    const {
      autoFocus,
      children,
      className,
      disabled,
      onClick,
      size = Size.DEFAULT,
      type = 'button',
      use = 'default',
      danger = false,
      ...rest
    } = props;
    const buttonElement = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => buttonElement.current);

    function focus() {
      buttonElement.current?.focus();
    }

    useEffect(() => {
      if (autoFocus === true) {
        focus();
      }
    }, [autoFocus]);

    const buttonProps = {
      type,
      className: cn(cls.btn, cls[use], className, {
        [cls.lg]: size === Size.LARGE,
        [cls.danger]: danger,
      }),
      ref: buttonElement,
      disabled,
      onClick,
      title: typeof children === 'string' ? (children as string) : '',
      ...rest,
    };

    return <button {...buttonProps}>{children}</button>;
  })
);
