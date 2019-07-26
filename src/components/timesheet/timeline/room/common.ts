import { Event } from '../../types';
import { splitTimeString, minutesToHours } from 'service/dates';

export type CommonSlot = { width: number; offset: number };
export type Slot = Event & { width: number };

const rangesLength = 60;

export function prepareRanges(events: Event[], firstHour: number) {
  const eventsData = new Map();
  const eventRanges = new Array<string>(rangesLength);

  let startTimeOffset, endTimeOffset;
  events.forEach(event => {
    eventsData.set(event.id, event);
    const [startHour, startMinutes] = splitTimeString(event.startTime);
    const [endHour, endMinutes] = splitTimeString(event.endTime);

    startTimeOffset = (startHour - firstHour) * 4 + startMinutes / 15;
    endTimeOffset = (endHour - firstHour) * 4 + endMinutes / 15;
    for (let i = startTimeOffset; i < endTimeOffset; i++) {
      eventRanges[i] = event.id;
    }
  });

  const slotRanges: (Slot | CommonSlot)[] = [];
  let prevEvent: boolean = null!,
    currentRange = 0,
    offset = 0;

  for (let m = 0; m <= rangesLength; m++) {
    const currEvent = typeof eventRanges[m] !== 'undefined';
    if (m === 0) {
      currentRange = 1;
    } else if (currEvent !== prevEvent || (!prevEvent && m % 4 === 0)) {
      if (prevEvent) {
        const event: Slot = Object.assign(eventsData.get(eventRanges[m - 1]), {
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

export function formatCapacity(
  minCapacity: number | null,
  maxCapacity: number | null
) {
  const hasMinCapacity = minCapacity !== null && minCapacity !== 0;
  const hasMaxCapacity = maxCapacity !== null && maxCapacity !== 0;
  if (hasMinCapacity) {
    if (hasMaxCapacity) {
      return `${minCapacity}–${maxCapacity} человек`;
    }
    return `от ${minCapacity} человек`;
  }
  if (hasMaxCapacity) {
    return `до ${maxCapacity} человек`;
  }
  return '';
}

export function offsetToTime(
  firstHour: number,
  offset: number,
  length: number
) {
  const startMinutes = (firstHour * 4 + offset) * 15;
  const endMinutes = startMinutes + length * 15;
  return [minutesToHours(startMinutes), minutesToHours(endMinutes)];
}
