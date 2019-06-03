import React from 'react';

import { ReactComponent as Logo } from './logo.svg';
import './header.module.scss';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = props => (
  <header>
    <Logo />
    {props.children}
  </header>
);
