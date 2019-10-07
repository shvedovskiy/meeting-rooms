import { Table, Event, EventsMap } from './types';
import { HOURS, splitTimeString, RANGES_LEN } from 'service/dates';

const firstHour = HOURS[0];

export function calculateTable(events: Event[]) {
  const table: Table = new Map();
  const eventsMap: EventsMap = new Map();

  let startTimeOffset, endTimeOffset;
  for (const event of events) {
    eventsMap.set(event.id, event);

    // Generate 15 minute event intervals:
    const [startHour, startMinutes] = splitTimeString(event.startTime);
    const [endHour, endMinutes] = splitTimeString(event.endTime);
    startTimeOffset = (startHour - firstHour) * 4 + startMinutes / 15;
    endTimeOffset = (endHour - firstHour) * 4 + endMinutes / 15;
    const intervals: number[] = [];
    for (let i = startTimeOffset; i < endTimeOffset; i++) {
      intervals.push(i);
    }

    // Fill table:
    const eventTimestamp = event.date.getTime();
    const roomID = event.room.id;
    if (!table.has(eventTimestamp)) {
      table.set(eventTimestamp, {});
    }

    const dayEvents = table.get(eventTimestamp)!;
    let roomEventRanges: string[];
    if (!dayEvents[roomID] || !dayEvents[roomID].length) {
      roomEventRanges = new Array<string>(RANGES_LEN);
      for (const i of intervals) {
        roomEventRanges[i] = event.id;
      }
      dayEvents[roomID] = roomEventRanges;
    } else {
      roomEventRanges = dayEvents[roomID];
      for (const i of intervals) {
        roomEventRanges[i] = event.id;
      }
    }
  }
  return [table, eventsMap];
}
