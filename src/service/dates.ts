import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  lightFormat,
  isBefore,
} from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

export const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export const RANGES_LEN = 60;

export function format(date: Date, format = 'd MMMM') {
  return dateFnsFormat(date, format, { locale: ruLocale });
}

export function parse(date: string, format: string, fallback: number | Date = Date.now()) {
  return dateFnsParse(date, format, fallback, { locale: ruLocale });
}

export function roundDate(date: number) {
  const ms = 1000 * 60 * 5;
  return new Date(Math.ceil(date / ms) * ms);
}

export function dateToTimeString(date: Date) {
  return lightFormat(date, 'H:mm');
}

export function splitTimeString(time: string) {
  return time.split(':').map(part => Number.parseInt(part, 10));
}

export function timeToRange(startTime: string, endTime: string) {
  const [startHours, startMinutes] = splitTimeString(startTime);
  const [endHours, endMinutes] = splitTimeString(endTime);
  const startTimeOffset = (startHours - HOURS[0]) * 4 + startMinutes / 15;
  const endTimeOffset = (endHours - HOURS[0]) * 4 + endMinutes / 15;
  return [startTimeOffset, endTimeOffset] as const;
}

export function rangeToTime(startTimeOffset: number, endTimeOffset: number) {
  const minutesBeforeStart = 60 * HOURS[0]; // 480 mins
  const startTime = minutesToHours(startTimeOffset * 15 + minutesBeforeStart);
  const endTime = minutesToHours(endTimeOffset * 15 + minutesBeforeStart);
  return [startTime, endTime] as const;
}

export function minutesToHours(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function isPastTime(timeStr: string, pivot: number = Date.now()) {
  return isBefore(parse(timeStr + ':00', 'HH:mm:ss', pivot), pivot);
}

export function compareTimeStrings(value1: string, value2: string) {
  const dateStart = new Date(),
    dateEnd = new Date(dateStart.getTime());
  const [hours1, minutes1] = splitTimeString(value1);
  const [hours2, minutes2] = splitTimeString(value2);
  dateStart.setHours(hours1, minutes1);
  dateEnd.setHours(hours2, minutes2);

  return isBefore(dateStart, dateEnd);
}
