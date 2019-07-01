import React, { FC } from 'react';
import { WeekdayElementProps } from 'react-day-picker';
import classNames from 'classnames';

import classes from './calendar.module.scss';

export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const LABELS = {
  nextMonth: 'следующий месяц',
  previousMonth: 'предыдущий месяц',
};

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const WEEKDAYS_LONG = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export const Weekday: FC<WeekdayElementProps> = ({
  weekday,
  className: defaultClass,
}) => {
  const className = classNames(defaultClass, {
    [classes.weekend]: weekday === 6 || weekday === 0,
  });
  return (
    <div className={className} title={WEEKDAYS_LONG[weekday]}>
      {WEEKDAYS_SHORT[weekday]}
    </div>
  );
};
