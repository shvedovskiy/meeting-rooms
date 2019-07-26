import React from 'react';

import classes from './error.module.scss';

export const Error = () => (
  <div className={classes.container}>
    <h1 className={classes.title}>Что-то пошло не так</h1>
    <p className={classes.text}>
      Сайт не работает, но мы уже решаем эту проблему.
    </p>
    <p className={classes.text}>
      Попробуйте{' '}
      <button className={classes.link} onClick={() => window.location.reload()}>
        обновить страницу
      </button>
      .
    </p>
  </div>
);
