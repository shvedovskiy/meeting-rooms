import React, { useRef, useEffect, MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Size } from 'context/size-context';
import classes from './icon-button.module.scss';
import { Icon, IconType } from '../icon/icon';

export type Props = {
  ariaLabel?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  size?: Size;
  icon: IconType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = (props: Props) => {
  const buttonNode = useRef<HTMLButtonElement>(null!);
  const {
    ariaLabel,
    autoFocus,
    size = 'default',
    icon,
    disabled,
    onClick,
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
    className: classNames(classes.btn, {
      [classes.lg]: size === 'large',
    }),
    ref: buttonNode,
    disabled,
    onClick,
  };

  return (
    <button {...buttonProps}>
      <Icon name={icon} size={size} className={classes.icon} />
    </button>
  );
};
