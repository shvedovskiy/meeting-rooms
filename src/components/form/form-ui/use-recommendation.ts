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
import { RoomCard, RoomData, Event } from 'components/timesheet/types';
import { StateValues } from 'components/common/use-form';
import { UpdateEventVariables } from 'service/mutations';
import {
  measureDistanceToRoom,
  measureDistanceToNewRoom,
  measureDistanceToAnyRoom,
  MovedRoomsEvents,
  DayTable,
} from './utils';

function findFreeRooms(
  startTime: string,
  endTime: string,
  dayTable: DayTable,
  eventUsersNum: number,
  rooms: RoomData[],
  events: Map<string, Event>,
  comparator: <T extends RoomCard | RoomData>(a: T, b: T) => number
) {
  const free: RoomCard[] = [];
  // Rooms available at least half time of scheduled meeting:
  const candidateRooms = new Map<string, RoomCard>();
  // Ids of events occurring in candidate rooms during our event:
  const candidateEvents = new Map<string, Set<string>>();
  const [startOffset, endOffset] = timeToRange(startTime, endTime);

  for (const room of rooms.sort(comparator)) {
    const roomEventsIds = dayTable[room.id];
    // The room is free at the appointed time:
    if (!roomEventsIds) {
      const len = free.push({ ...room, startTime, endTime });
      if (len >= 5 || len === rooms.length) {
        return free;
      }
      continue;
    }

    let cnt = 0;
    for (let i = startOffset; i < endOffset; i++) {
      const eventId = roomEventsIds[i];
      if (typeof eventId === 'undefined') {
        cnt++;
      } else {
        // Save id of the conflicting meeting for its subsequent movement:
        if (candidateEvents.has(room.id)) {
          candidateEvents.get(room.id)!.add(eventId);
        } else {
          candidateEvents.set(room.id, new Set([eventId]));
        }
      }
    }
    if (cnt === endOffset - startOffset) {
      // The room is free at the appointed time:
      const len = free.push({ ...room, startTime, endTime });
      if (len >= 5 || len === rooms.length) {
        return free;
      }
      continue;
    }

    const candidateRoomEvents = candidateEvents.has(room.id)
      ? Array.from(candidateEvents.get(room.id)!.values())
      : [];
    const candidateUsersNums = candidateRoomEvents.map(
      id => events.get(id)!.users.length
    );
    if (
      cnt >= Math.ceil((endOffset - startOffset) / 2) ||
      candidateUsersNums.every(num => num < eventUsersNum)
    ) {
      // The room is available at least half time of appointed time
      // or contains meetings with fewer participants than the planned meeting:
      candidateRooms.set(room.id, { ...room, startTime, endTime });
    }
  }
  return { free, candidateRooms, candidateEvents };
}

function moveConflictingEvents(
  roomsToMove: Map<string, RoomCard>,
  conflictingEvents: Map<string, Set<string>>,
  forbiddenRoomsIds: Set<string>,
  dayTable: DayTable,
  rooms: RoomData[],
  events: Map<string, Event>,
  comparator: (moved: MovedRoomsEvents) => (a: RoomCard, b: RoomCard) => number
) {
  const movedEvents: MovedRoomsEvents = new Map();

  for (const roomId of roomsToMove.keys()) {
    // TS check:
    if (!conflictingEvents.has(roomId)) {
      continue;
    }
    const roomConflictingEvents = conflictingEvents.get(roomId);
    if (!roomConflictingEvents) {
      continue;
    }
    // Collecting rooms that can be vacated:
    const movedEventsIds = Array.from(roomConflictingEvents).reduce(
      (moved, eventId) => {
        const roomEvent = events.get(eventId);
        if (!roomEvent) {
          return moved;
        }
        const [startOffset, endOffset] = timeToRange(
          roomEvent.startTime,
          roomEvent.endTime
        );
        // Looking for target room to move the conflicting meeting:
        const targetRoom = rooms.find(({ id, maxCapacity }) => {
          if (
            roomId === id ||
            forbiddenRoomsIds.has(id) ||
            (maxCapacity || Infinity) < roomEvent.users.length
          ) {
            return false;
          }
          const roomEvents = dayTable![id];
          let cnt = 0;
          for (let i = startOffset; i < endOffset; i++) {
            if (typeof roomEvents[i] === 'undefined') {
              cnt++;
            }
          }
          return cnt === endOffset - startOffset;
        });
        if (!targetRoom) {
          return moved;
        } else {
          conflictingEvents.delete(targetRoom.id);
          const updatedEvent: UpdateEventVariables = {
            id: eventId,
            roomId: targetRoom.id,
          };
          return moved.concat(updatedEvent);
        }
      },
      [] as UpdateEventVariables[]
    );
    if (movedEventsIds.length) {
      forbiddenRoomsIds.add(roomId);
      movedEvents.set(roomId, movedEventsIds);
    }
  }

  const movedRoomDefs = Array.from(movedEvents.keys())
    .map(id => roomsToMove.get(id)!)
    .sort(comparator(movedEvents))
    .slice(0, 5 - forbiddenRoomsIds.size);
  const slicedMovedEvents = new Map(
    movedRoomDefs.map(({ id }) => [id, movedEvents.get(id)!])
  );
  return [movedRoomDefs, slicedMovedEvents] as const;
}

function findAnotherTimeSlot(rooms: RoomData[]): RoomCard[] {
  for (const roomDef of rooms) {
  }
  return []; // TODO sort
}

export function useRecommendation(
  eventValues: StateValues<FormFields>,
  recommendationNeeded: boolean,
  movedEvents: MutableRefObject<UpdateEventVariables[]>
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
  const { rooms: allRooms, eventsMap: allEvents, table } = data!;
  const { startTime, endTime, date, users } = eventValues;
  const recommendedRooms = useMemo<RoomCard[]>(() => {
    if (
      !recommendationNeeded ||
      ![date, endTime, startTime, users].every(Boolean)
    ) {
      return [];
    }

    const eventUsersFloors = users!.map(u => u.homeFloor);
    const roomDistanceComp = <T extends RoomCard | RoomData>(a: T, b: T) =>
      measureDistanceToRoom(a, eventUsersFloors) -
      measureDistanceToRoom(b, eventUsersFloors);

    const capableRooms = allRooms.filter(
      r => (r.maxCapacity || Infinity) >= users!.length
    );
    const dayTable = table.get(date!.getTime());
    // All rooms are free:
    if (!dayTable) {
      return capableRooms
        .map(r => ({ ...r, startTime, endTime }))
        .sort(roomDistanceComp)
        .slice(0, 5);
    }

    const searchResult = findFreeRooms(
      startTime,
      endTime,
      dayTable,
      users!.length,
      capableRooms,
      allEvents,
      roomDistanceComp
    );
    if (Array.isArray(searchResult)) {
      return searchResult;
    }
    const {
      free: sortedFree,
      candidateRooms: candidates,
      candidateEvents,
    } = searchResult;

    // Trying to move conflicting meetings out of candidate rooms:
    const freeRoomsIds = new Set(sortedFree.map(r => r.id));
    const movedRoomsComp = (moved: MovedRoomsEvents) => (
      a: RoomCard,
      b: RoomCard
    ) =>
      measureDistanceToNewRoom(a, moved, allEvents, eventUsersFloors) -
      measureDistanceToNewRoom(b, moved, allEvents, eventUsersFloors);

    const [sortedMovedRooms, movedEvs] = moveConflictingEvents(
      candidates,
      candidateEvents,
      freeRoomsIds,
      dayTable,
      allRooms,
      allEvents,
      movedRoomsComp
    );
    movedEvents.current = Array.from(movedEvs.values()).flat();

    const anyRoomComp = (a: RoomCard, b: RoomCard) =>
      measureDistanceToAnyRoom(a, movedEvs, allEvents, eventUsersFloors) -
      measureDistanceToAnyRoom(b, movedEvs, allEvents, eventUsersFloors);
    const freeWithMoved = [...sortedFree, ...sortedMovedRooms].sort(
      anyRoomComp
    );
    if (
      !(freeWithMoved.length < 5) ||
      freeWithMoved.length === capableRooms.length
    ) {
      return freeWithMoved;
    }

    return freeWithMoved.concat(
      findAnotherTimeSlot(capableRooms).slice(0, 5 - freeWithMoved.length)
    );
  }, [
    recommendationNeeded,
    date,
    endTime,
    startTime,
    users,
    table,
    allRooms,
    allEvents,
    movedEvents,
  ]);

  return recommendedRooms;
}
