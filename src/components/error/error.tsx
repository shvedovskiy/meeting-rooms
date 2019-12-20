import React from 'react';
import cn from 'classnames';

import cls from './error.module.scss';

type Props = {
  className?: string;
};

export const Error = ({ className }: Props) => (
  <div className={cn(className)}>
    <h1 className={cls.title}>Что-то пошло не так</h1>
    <p className={cls.text}>Сайт не работает, но мы уже решаем эту проблему.</p>
    <p className={cls.text}>
      Попробуйте{' '}
      <button className={cls.link} onClick={() => window.location.reload()}>
        обновить страницу
      </button>
      .
    </p>
  </div>
);
