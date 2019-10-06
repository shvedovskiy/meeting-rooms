import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { RoomCard } from 'components/timesheet/types';
import { PageData } from 'context/page-context';

import { ROOMS_QUERY, RoomsQueryType } from 'service/queries';

export function useRecommendation(
  event: PageData
): [RoomCard | null, RoomCard[]] {
  const { data: roomsData } = useQuery<RoomsQueryType>(gql`
    query {
      ${ROOMS_QUERY}
    }
  `);

  const [eventRoom, recommendedRooms] = useMemo(() => {
    let eventRoom: RoomCard | null = null;

    const recommendedRooms = roomsData!.rooms.map(r => {
      if (event.room && r.id === event.room.id) {
        eventRoom = {
          ...r,
          startTime: event.startTime!,
          endTime: event.endTime!,
        };
        return eventRoom;
      }
      return {
        ...r,
        startTime: '13:00',
        endTime: '14:00',
      };
    });

    return [eventRoom, recommendedRooms];
  }, [event.endTime, event.room, event.startTime, roomsData]);

  return [eventRoom, recommendedRooms];
}
