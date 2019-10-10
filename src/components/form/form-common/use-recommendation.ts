import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { RoomCard, Event } from 'components/timesheet/types';
import { PageData } from 'context/page-context';

import {
  ROOMS_QUERY,
  EVENTS_MAP_QUERY,
  TABLE_QUERY,
  RoomsQueryType,
  EventsMapQueryType,
  TableQueryType,
} from 'service/queries';
import { timeToRange } from 'service/dates';

export function useRecommendation(event: PageData) {
  const { data } = useQuery<
    RoomsQueryType & EventsMapQueryType & TableQueryType
  >(gql`
    query {
      ${ROOMS_QUERY}
      ${EVENTS_MAP_QUERY}
      ${TABLE_QUERY}
    }
  `);
  const { rooms, eventsMap, table } = data!;
  const { date, endTime, startTime, users, room } = event;

  const currentRoom = useMemo<RoomCard | null>(() => {
    const initialRoom = room;
    if (initialRoom) {
      const roomInfo = rooms.find(r => r.id === initialRoom.id);
      if (roomInfo) {
        return {
          ...roomInfo,
          startTime: startTime!,
          endTime: endTime!,
        };
      }
    }
    return null;
  }, [rooms, startTime, endTime, room]);

  const recommendedRooms = useMemo<RoomCard[]>(() => {
    const dayTable = table.get(date!.getTime());
    if (!dayTable) {
      return rooms
        .map(r => ({
          ...r,
          startTime: startTime!,
          endTime: endTime!,
        }))
        .sort() // TODO
        .slice(0, 5);
    }

    const free: RoomCard[] = [];
    const halfFree: string[] = [];
    let startOffset, endOffset;

    const capableRooms = rooms.filter(
      r => r.maxCapacity || Infinity >= (users || []).length
    );

    for (const roomDef of capableRooms) {
      const roomEvents = dayTable[roomDef.id];
      if (roomEvents) {
        free.push({
          ...roomDef,
          startTime: startTime!,
          endTime: endTime!,
        });
      } else {
        const event = eventsMap.get(roomDef.id);
        if (!event) {
          continue;
        }
        [startOffset, endOffset] = timeToRange(startTime!, endTime!);
        let cnt = 0;
        for (let i = startOffset; i < endOffset; i++) {
          if (typeof roomEvents[i] === 'undefined') {
            cnt++;
          }
        }

        if (cnt >= endOffset - startOffset) {
          halfFree.push(roomDef.id);
        }
      }
    }

    if (free.length >= 5) {
      return free
        .sort() // TODO
        .slice(0, 5);
    }

    for (const idx of halfFree) {
      // TODO
    }

    return [
      {
        ...rooms[0],
        startTime: '13:00',
        endTime: '14:00',
      },
    ];
  }, [date, endTime, eventsMap, rooms, startTime, table, users]);

  return [currentRoom, recommendedRooms] as const;
}
