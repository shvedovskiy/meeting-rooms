import React from 'react';

import classes from './spinner.module.scss';

export const Spinner = () => (
  <div className={classes.loader}>
    <div className="vertical-helper" />
    <div className="spinner" />
  </div>
);
