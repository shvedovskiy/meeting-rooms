import React, { memo, useRef, useEffect, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import { Icon, IconType } from '../icon/icon';
import { Size } from 'context/size-context';
import { Override } from 'service/typings';
import cls from './icon-button.module.scss';

type ArgsType = any[];
export type Props = Override<
  ButtonHTMLAttributes<HTMLButtonElement>,
  {
    ariaLabel?: string;
    autoFocus?: boolean;
    className?: string;
    disabled?: boolean;
    size?: Size;
    icon: IconType;
    onClick?: (...args: ArgsType) => any;
    onClickArgs?: ArgsType;
  }
>;

export const IconButton = memo((props: Props) => {
  const buttonNode = useRef<HTMLButtonElement>(null!);
  const {
    ariaLabel,
    autoFocus,
    className,
    size = Size.DEFAULT,
    icon,
    disabled,
    onClick,
    onClickArgs = [],
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
    'aria-label': ariaLabel,
    type: 'button' as const,
    title: ariaLabel,
    className: cn(cls.btn, className, {
      [cls.lg]: size === Size.LARGE,
      [cls.disabled]: disabled,
    }),
    ref: buttonNode,
    disabled,
    onClick() {
      onClick?.(...onClickArgs);
    },
  };

  return (
    <button {...buttonProps}>
      <Icon name={icon} size={size} className={cls.icon} />
    </button>
  );
});
