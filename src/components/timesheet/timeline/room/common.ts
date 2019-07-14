import { Event, RoomCapacity } from '../../types';
import { splitTimeString } from 'service/dates';

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

  const slotRanges: (Partial<Event> & { width: number })[] = [];
  let prevEvent: boolean = null!,
    currentRange = 0;

  for (let m = 0; m <= rangesLength; m++) {
    const currEvent = eventRanges[m] !== undefined;
    if (m === 0) {
      currentRange = 1;
    } else if (currEvent !== prevEvent || (!prevEvent && m % 4 === 0)) {
      if (prevEvent) {
        const event = Object.assign(eventsData.get(eventRanges[m - 1]), {
          width: currentRange,
        });
        slotRanges.push(event);
      } else {
        slotRanges.push({ width: currentRange });
      }
      currentRange = 1;
    } else {
      currentRange++;
    }
    prevEvent = currEvent;
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
