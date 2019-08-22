import { lightFormat, isBefore, isAfter, isEqual, parse } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

export const HOURS = [
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];

export function roundDate(date: number) {
  const ms = 1000 * 60 * 5;
  return new Date(Math.ceil(date / ms) * ms);
}

export function getTimeString(date: Date) {
  return lightFormat(date, 'H:mm');
}

export function splitTimeString(time: string) {
  return time.split(':').map(part => Number.parseInt(part, 10));
}

export function minutesToHours(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function isTimeInPast(timeStr: string, now: number = Date.now()) {
  return isBefore(
    parse(timeStr + ':00', 'HH:mm:ss', now, { locale: ruLocale }),
    now
  );
}

export function compareTimes(value1: string, value2: string) {
  const dateStart = new Date(),
    dateEnd = new Date(dateStart.getTime());
  const [hours1, minutes1] = splitTimeString(value1);
  const [hours2, minutes2] = splitTimeString(value2);
  dateStart.setHours(hours1, minutes1);
  dateEnd.setHours(hours2, minutes2);
  if (isAfter(dateStart, dateEnd) || isEqual(dateStart, dateEnd)) {
    return false;
  }
  return true;
}
