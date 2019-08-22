import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { parseISO } from 'date-fns/esm';

import {
  GET_EVENTS,
  GET_ROOMS_LOCAL,
  RoomsQueryType,
  EventsQueryType,
} from 'service/queries';
import { TimesheetComponent } from './timesheet-component';
import { Table, FloorDefinition, RoomData, ServerEvent, Event } from './types';
import { Spinner } from 'components/ui/spinner/spinner';

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
  const { loading, data: eventsData } = useQuery<EventsQueryType>(GET_EVENTS);
  const { data: roomsData } = useQuery<RoomsQueryType>(GET_ROOMS_LOCAL);

  if (loading) {
    return <Spinner />;
  }

  const events = eventsData ? eventsData.events : [];
  const rooms = roomsData ? roomsData.rooms : [];
  const [floors, table] = calculateTimesheet(rooms, events);

  return <TimesheetComponent floors={floors} table={table} />;
};
