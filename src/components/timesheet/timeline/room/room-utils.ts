import { Event, EventsMap } from '../../types';
import { minutesToHours, RANGES_LEN } from 'service/dates';

export type CommonSlot = { width: number; offset: number };
export type Slot = Event & { width: number };

export function prepareRanges(eventRanges: string[], eventsMap: EventsMap) {
  const slotRanges: (Slot | CommonSlot)[] = [];
  let prevEvent: boolean = null!,
    currentRange = 0,
    offset = 0;

  for (let m = 0; m <= RANGES_LEN; m++) {
    const currEvent = typeof eventRanges[m] !== 'undefined';
    if (m === 0) {
      currentRange = 1;
    } else if (
      currEvent !== prevEvent || // the type of range has changed
      eventRanges[m] !== eventRanges[m - 1] || // the boundary between two event ranges has been reached
      (!prevEvent && m % 4 === 0) // the next hour reached in the free time range
    ) {
      if (prevEvent) {
        const event: Slot = Object.assign(eventsMap.get(eventRanges[m - 1]), {
          width: currentRange,
        });
        slotRanges.push(event);
      } else {
        slotRanges.push({ width: currentRange, offset });
      }
      currentRange = 1;
      offset = m;
    } else {
      currentRange++;
    }
    prevEvent = currEvent;
  }
  return slotRanges;
}

export function formatCapacity(minCapacity: number | null, maxCapacity: number | null) {
  const hasMinCapacity = minCapacity !== null && minCapacity !== 0;
  const hasMaxCapacity = maxCapacity !== null && maxCapacity !== 0;
  if (hasMinCapacity) {
    if (hasMaxCapacity) {
      return `${minCapacity}\u2013${maxCapacity} человек`;
    }
    return `от ${minCapacity} человек`;
  }
  if (hasMaxCapacity) {
    return `до ${maxCapacity} человек`;
  }
  return '';
}

export function offsetToTime(firstHour: number, offset: number, length: number) {
  const startMinutes = (firstHour * 4 + offset) * 15;
  const endMinutes = startMinutes + length * 15;
  return [minutesToHours(startMinutes), minutesToHours(endMinutes)];
}
