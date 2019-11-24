import { format as dateFnsFormat, parse as dateFnsParse } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

export const FORMAT = 'd MMMM, y';

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

export const VALID_MONTHS = [
  'января,',
  'февраля,',
  'марта,',
  'апреля,',
  'мая,',
  'июня,',
  'июля,',
  'августа,',
  'сентября,',
  'октября,',
  'ноября,',
  'декабря,',
];

export const LABELS = {
  nextMonth: 'следующий месяц',
  previousMonth: 'предыдущий месяц',
};

export const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export const WEEKDAYS_LONG = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export function formatDate(date: Date, format: string = FORMAT) {
  return dateFnsFormat(date, format, { locale: ruLocale });
}

export function parseDate(str: string, format: string = FORMAT) {
  return dateFnsParse(str, format, Date.now(), { locale: ruLocale });
}

export function isDateIncomplete(date: string) {
  if (date.trim().length === 0) {
    return true;
  }
  const parts = date.trim().split(' ');
  if (parts.length > 3) {
    return false;
  }

  let part1Full = false,
    part2Full = false;
  if (!/^\d{1,2}$/.test(parts[0])) {
    return false;
  } else if (/^\d{2}$/.test(parts[0])) {
    part1Full = true;
  }

  if (part1Full && parts.length > 1) {
    if (!VALID_MONTHS.find(m => m.includes(parts[1]))) {
      return false;
    } else if (VALID_MONTHS.find(m => m === parts[1])) {
      part2Full = true;
    }
  } else if (parts.length > 1) {
    return false;
  }

  if (part2Full && parts.length > 2) {
    return /^\d{1,3}$/.test(parts[2]);
  } else if (parts.length > 2) {
    return false;
  }
  return true;
}
