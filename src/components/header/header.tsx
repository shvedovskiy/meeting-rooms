import React from 'react';

import { ReactComponent as Logo } from './logo.svg';
import classes from './header.module.scss';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className={classes.root}>
      <Logo />
      {children}
    </header>
  );
};
