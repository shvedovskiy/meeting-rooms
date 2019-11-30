import React, { memo, useRef, useEffect, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import { Icon, IconType } from '../icon/icon';
import { Size } from 'context/size-context';
import { Override } from 'service/typings';
import classes from './icon-button.module.scss';

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
    size = 'default',
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
    title: ariaLabel,
    className: cn(classes.btn, className, {
      [classes.lg]: size === 'large',
      [classes.disabled]: disabled,
    }),
    ref: buttonNode,
    disabled,
    onClick() {
      if (onClick) {
        onClick(...onClickArgs);
      }
    },
  };

  return (
    <button {...buttonProps}>
      <Icon name={icon} size={size} className={classes.icon} />
    </button>
  );
});
