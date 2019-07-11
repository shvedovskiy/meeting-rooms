import { getMinutes, getHours } from 'date-fns/esm';

export interface Event {
  title: string;
  startTime: Date;
  endTime: Date;
  floor: number;
}
export type RoomCapacity = Map<string, number>;
export interface RoomData {
  name: string;
  capacity: RoomCapacity;
  available: boolean;
  events?: Event[];
}

const rangesLength = 60;
// const percentageCoefficient = 100 / rangesLength;

export function prepareRanges(events: Event[], startHour: number) {
  const eventRanges = new Set<number>();
  let startTimeOffset, endTimeOffset;
  events.forEach(event => {
    startTimeOffset =
      (getHours(event.startTime) - startHour) * 4 +
      getMinutes(event.startTime) / 15;
    endTimeOffset =
      (getHours(event.endTime) - startHour) * 4 +
      getMinutes(event.endTime) / 15;
    for (let i = startTimeOffset; i < endTimeOffset; i++) {
      eventRanges.add(i);
    }
  });

  const slotRanges: number[] = [];
  let prevEvent: boolean = null!,
    currentRange = 0;
  for (let m = 0; m <= rangesLength; m++) {
    const isEvent = eventRanges.has(m);
    if (m % 4 === 0) {
      if (m > 0) {
        slotRanges.push(currentRange);
      }
      currentRange = 1;
      prevEvent = isEvent ? true : false;
    } else if (isEvent) {
      if (prevEvent) {
        currentRange++;
      } else {
        slotRanges.push(currentRange);
        currentRange = 1;
        prevEvent = true;
      }
    } else {
      if (prevEvent) {
        slotRanges.push(currentRange);
        currentRange = 1;
        prevEvent = false;
      } else {
        currentRange++;
      }
    }
  }
  return slotRanges;
}

export function formatCapacity(capacity: RoomCapacity) {
  if (capacity.has('min')) {
    if (capacity.has('max')) {
      return `${capacity.get('min')}–${capacity.get('max')} человек`;
    }
    return `от ${capacity.get('min')} человек`;
  }
  if (capacity.has('max')) {
    return `до ${capacity.get('max')} человек`;
  }
  return '';
}
