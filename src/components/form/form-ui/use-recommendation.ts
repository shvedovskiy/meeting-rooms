import { useMemo, MutableRefObject } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  ROOMS_QUERY,
  EVENTS_MAP_QUERY,
  TABLE_QUERY,
  RoomsQueryType,
  EventsMapQueryType,
  TableQueryType,
} from 'service/queries';
import { timeToRange } from 'service/dates';
import { FormFields } from '../form-common/validators';
import { RoomCard } from 'components/timesheet/types';

export function useRecommendation(
  event: FormFields,
  calculateRecommendation: boolean,
  movedRooms: MutableRefObject<string[]>
) {
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

  const recommendedRooms = useMemo<RoomCard[]>(() => {
    if (!calculateRecommendation) {
      return [];
    }

    const eventUsersFloors = users!.map(u => u.homeFloor);
    const roomDistanceComparator = (a: RoomCard, b: RoomCard) =>
      Math.abs(
        eventUsersFloors.reduce((sum, next) => sum + (a.floor - next), 0)
      ) -
      Math.abs(
        eventUsersFloors.reduce((sum, next) => sum + (b.floor - next), 0)
      );

    const dayTable = table.get(date!.getTime());
    if (!dayTable) {
      return rooms
        .map(r => ({
          ...r,
          startTime: startTime!,
          endTime: endTime!,
        }))
        .sort(roomDistanceComparator)
        .slice(0, 5);
    }

    // const free: RoomCard[] = [];
    // const halfFree: string[] = [];
    // let startOffset, endOffset;

    // const capableRooms = rooms.filter(
    //   r => r.maxCapacity || Infinity >= (users || []).length
    // );

    // for (const roomDef of capableRooms) {
    //   const roomEvents = dayTable[roomDef.id];
    //   if (roomEvents) {
    //     free.push({
    //       ...roomDef,
    //       startTime: startTime!,
    //       endTime: endTime!,
    //     });
    //   } else {
    //     const event = eventsMap.get(roomDef.id);
    //     if (!event) {
    //       continue;
    //     }
    //     [startOffset, endOffset] = timeToRange(startTime!, endTime!);
    //     let cnt = 0;
    //     for (let i = startOffset; i < endOffset; i++) {
    //       if (typeof roomEvents[i] === 'undefined') {
    //         cnt++;
    //       }
    //     }

    //     if (cnt >= endOffset - startOffset) {
    //       halfFree.push(roomDef.id);
    //     }
    //   }
    // }

    // if (free.length >= 5) {
    //   return free.sort(roomDistanceComparator).slice(0, 5);
    // }

    // for (const idx of halfFree) {
    //   // TODO
    // }

    return rooms.map(r => ({
      ...r,
      title: 'Room Name',
      startTime: '13:00',
      endTime: '14:00',
    }));
  }, [calculateRecommendation, rooms, table, startTime, endTime, date, users]);
  return recommendedRooms;
}
