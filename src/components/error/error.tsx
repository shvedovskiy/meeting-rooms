import React from 'react';
import cn from 'classnames';

import classes from './error.module.scss';

interface Props {
  className?: string;
}

export const Error = ({ className }: Props) => (
  <div className={cn(className)}>
    <h1 className={classes.title}>Что-то пошло не так</h1>
    <p className={classes.text}>Сайт не работает, но мы уже решаем эту проблему.</p>
    <p className={classes.text}>
      Попробуйте{' '}
      <button className={classes.link} onClick={() => window.location.reload()}>
        обновить страницу
      </button>
      .
    </p>
  </div>
);
