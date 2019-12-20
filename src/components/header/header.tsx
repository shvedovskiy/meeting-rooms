import React from 'react';
import cn from 'classnames';

import { useSizeCtx, Size } from 'context/size-context';
import { ReactComponent as Logo } from './logo.svg';
import cls from './header.module.scss';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const size = useSizeCtx() ?? Size.DEFAULT;

  return (
    <header className={cn(cls.root, { [cls.lg]: size === Size.LARGE })}>
      <Logo />
      {children}
    </header>
  );
};
