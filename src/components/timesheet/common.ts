import { parseISO } from 'date-fns/esm';

import { Table, ServerEvent, Event } from './types';

export function calculateTable(events: ServerEvent[]): Table {
  const table: Table = new Map();

  for (const payloadEvent of events) {
    const eventDate = parseISO(payloadEvent.date);
    const event: Event = {
      ...payloadEvent,
      date: eventDate,
    };
    const eventTimestamp = eventDate.getTime();
    const roomID = event.room.id;

    if (table.has(eventTimestamp)) {
      const dayTable = table.get(eventTimestamp)!;
      if (dayTable[roomID]) {
        dayTable[roomID].push(event);
      } else {
        dayTable[roomID] = [event];
      }
    } else {
      table.set(eventTimestamp, {
        [roomID]: [event],
      });
    }
  }
  return table;
}
