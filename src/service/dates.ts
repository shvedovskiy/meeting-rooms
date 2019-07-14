import { lightFormat } from 'date-fns/esm';

export function roundDate(date: number) {
  const ms = 1000 * 60 * 5;
  return new Date(Math.ceil(date / ms) * ms);
}

export function getTimeString(date: Date) {
  return lightFormat(date, 'H:mm');
}

export function splitTimeString(time: string) {
  return time
    .split(':')
    .map(part =>
      Number.parseInt(part.startsWith('0') ? part.substring(1) : part)
    );
}
