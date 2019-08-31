import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { parseISO } from 'date-fns/esm';

import { TimesheetUI } from './timesheet-ui';
import { Table, FloorDefinition, RoomData, ServerEvent, Event } from './types';
import {
  ROOMS_EVENTS_QUERY,
  FLOORS_QUERY,
  TABLE_QUERY,
  RoomsEventsQueryType as QueryType,
} from 'service/queries';

function calculateTimesheet(
  rooms: RoomData[],
  events: ServerEvent[]
): [FloorDefinition, Table] {
  const floors: FloorDefinition = new Map();
  const table: Table = new Map();

  for (let room of rooms) {
    if (floors.has(room.floor)) {
      floors.get(room.floor)!.push(room);
    } else {
      floors.set(room.floor, [room]);
    }
  }

  for (let payloadEvent of events) {
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
  return [new Map([...floors].sort((r1, r2) => r1[0] - r2[0])), table];
}

export const Timesheet = () => {
  const { data, client } = useQuery<QueryType>(ROOMS_EVENTS_QUERY);

  const [floors, table] = calculateTimesheet(data!.rooms, data!.events);
  client.cache.writeQuery({
    query: TABLE_QUERY,
    data: {
      table,
    },
  });
  client.cache.writeQuery({
    query: FLOORS_QUERY,
    data: {
      floors,
    },
  });

  return <TimesheetUI />;
};
