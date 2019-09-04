import React from 'react';
import cn from 'classnames';

import classes from './spinner.module.scss';

type Props = {
  transparent?: boolean;
};

export const Spinner = ({ transparent = false }: Props) => (
  <div className={cn(classes.loader, { [classes.transparent]: transparent })}>
    <div className="vertical-helper" />
    <div className="spinner" />
  </div>
);
