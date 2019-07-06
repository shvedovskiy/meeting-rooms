import React, { useContext } from 'react';
import classNames from 'classnames';

import sizeContext from 'context/size-context';
import { ReactComponent as Logo } from './logo.svg';
import classes from './header.module.scss';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = props => {
  const size = useContext(sizeContext);

  return (
    <header
      className={classNames(classes.root, {
        [classes.sm]: size === 'large',
      })}
    >
      <Logo />
      {props.children}
    </header>
  );
};
