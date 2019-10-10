import { Table, Event, EventsMap } from './types';
import { RANGES_LEN, timeToRange } from 'service/dates';

export function calculateTable(events: Event[]) {
  const table: Table = new Map();
  const eventsMap: EventsMap = new Map();

  let startOffset, endOffset;
  for (const event of events) {
    eventsMap.set(event.id, event);

    // Generate 15 minute event intervals:
    [startOffset, endOffset] = timeToRange(event.startTime, event.endTime);
    const intervals: number[] = [];
    for (let i = startOffset; i < endOffset; i++) {
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
