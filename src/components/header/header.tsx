import React from 'react';
import cn from 'classnames';

import { ReactComponent as Logo } from './logo.svg';
import classes from './header.module.scss';
import { useSizeCtx } from 'context/size-context';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const size = useSizeCtx();

  return (
    <header className={cn(classes.root, { [classes.lg]: size === 'large' })}>
      <Logo />
      {children}
    </header>
  );
};
