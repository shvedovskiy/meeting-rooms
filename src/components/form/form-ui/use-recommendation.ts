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
} from 'service/apollo/queries';
import { timeToRange, RANGES_LEN, rangeToTime } from 'service/dates';
import { FormFields } from '../form-common/validators';
import { RoomCard, RoomData, Event } from 'components/timesheet/types';
import { StateValues } from 'components/common/use-form';
import { UpdateEventVars } from 'service/apollo/mutations';
import {
  measureDistanceToRoom,
  measureDistanceToNewRoom,
  measureDistanceToAnyRoom,
} from './utils';
import { EventToMove, RoomMovedEvents, DayTable } from '../form-common/types';

type Query = RoomsQueryType & EventsMapQueryType & TableQueryType;

function findFreeRooms(
  startTime: string,
  endTime: string,
  dayTable: DayTable,
  eventUsersNum: number,
  rooms: RoomData[],
  events: Map<string, Event>
) {
  const freeRooms: RoomCard[] = [];
  // Rooms available at least half time of scheduled meeting:
  const candidateRooms: RoomCard[] = [];
  // Ids of events in the candidate rooms during our event:
  const eventsFromCandidates = new Map<string, Set<string>>();
  const [startOffset, endOffset] = timeToRange(startTime, endTime);

  for (const room of rooms) {
    const roomEventsIds = dayTable[room.id];
    // The room is free at this time:
    if (!roomEventsIds) {
      const len = freeRooms.push({ ...room, startTime, endTime });
      if (len >= 5 || len === rooms.length) {
        return freeRooms.slice(0, 5);
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
        if (eventsFromCandidates.has(room.id)) {
          eventsFromCandidates.get(room.id)!.add(eventId);
        } else {
          eventsFromCandidates.set(room.id, new Set([eventId]));
        }
      }
    }
    if (cnt === endOffset - startOffset) {
      // The room is free at the appointed time:
      const len = freeRooms.push({ ...room, startTime, endTime });
      if (len >= 5 || len === rooms.length) {
        return freeRooms.slice(0, 5);
      }
      continue;
    }

    const candidateRoomEvents = eventsFromCandidates.has(room.id)
      ? Array.from(eventsFromCandidates.get(room.id)!.values())
      : [];
    const candidateUsersNums = candidateRoomEvents.map(id => events.get(id)!.users.length);
    if (
      cnt >= Math.ceil((endOffset - startOffset) / 2) ||
      candidateUsersNums.every(num => num < eventUsersNum)
    ) {
      // The room is available at least half time of appointed time
      // or contains meetings with fewer participants than the planned meeting:
      candidateRooms.push({ ...room, startTime, endTime });
    }
  }
  return { freeRooms, candidateRooms, eventsFromCandidates };
}

function moveConflictingEvents(
  roomsToMove: RoomCard[],
  conflictingEvents: Map<string, Set<string>>,
  forbiddenRooms: Set<string>,
  dayTable: DayTable,
  rooms: RoomData[],
  events: Map<string, Event>,
  comparator: (moved: RoomMovedEvents) => (a: RoomCard, b: RoomCard) => number
) {
  const movedEvents: RoomMovedEvents = new Map();
  for (const { id: roomId } of roomsToMove) {
    // TS check:
    if (!conflictingEvents.has(roomId)) {
      continue;
    }
    const roomConflictingEvents = conflictingEvents.get(roomId);
    if (!roomConflictingEvents) {
      continue;
    }
    // Collecting rooms that can be vacated:
    const movedEventsIds = Array.from(roomConflictingEvents).reduce((moved, eventId) => {
      const roomEvent = events.get(eventId);
      if (!roomEvent) {
        return moved;
      }
      const [startOffset, endOffset] = timeToRange(roomEvent.startTime, roomEvent.endTime);
      // Looking for target room to move the conflicting meeting:
      const targetRoom = rooms.find(({ id, maxCapacity }) => {
        if (
          roomId === id ||
          forbiddenRooms.has(id) ||
          (maxCapacity ?? Infinity) < roomEvent.users.length
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
        const updatedEvent: UpdateEventVars = {
          id: eventId,
          roomId: targetRoom.id,
        };
        return moved.concat(updatedEvent);
      }
    }, [] as UpdateEventVars[]);
    if (movedEventsIds.length) {
      forbiddenRooms.add(roomId);
      movedEvents.set(roomId, movedEventsIds);
    }
  }

  const movedRoomDefs = Array.from(movedEvents.keys())
    .map(id => roomsToMove.find(r => r.id === id)!)
    .sort(comparator(movedEvents))
    .slice(0, 5 - forbiddenRooms.size);
  const finalMovedEvents = new Map(movedRoomDefs.map(({ id }) => [id, movedEvents.get(id)!]));
  return [movedRoomDefs, finalMovedEvents] as const;
}

function findAnotherTime(
  startOffset: number,
  endOffset: number,
  freeRooms: Set<string>,
  dayTable: DayTable,
  rooms: RoomData[]
): RoomCard[] {
  const resultLength = 5 - freeRooms.size;
  if (resultLength <= 0) {
    return [];
  }
  const eventLength = endOffset - startOffset + 1;
  // Unique free slots start positions:
  const startValues = new Set<number>();
  const getSlots = (day: string[], start: number, end: number) => {
    // Continuous free intervals, longer than event:
    const ranges: number[][] = [];
    let i = start,
      cnt = 0,
      slot;
    for (; i < end; i++) {
      slot = day[i];
      if (typeof slot === 'undefined') {
        cnt++;
      } else {
        if (cnt >= eventLength) {
          ranges.push([i - cnt, i - 1]);
        }
        cnt = 0;
      }
    }
    if (cnt >= eventLength) {
      ranges.push([i - cnt, i - 1]);
    }
    // Starts of free time slots for a given day:
    const result: number[] = [];
    let range;
    // Looking for all possible slots in this interval:
    for (i = 0; i < ranges.length; i++) {
      range = ranges[i];
      for (let j = range[0]; j <= range[1] - eventLength + 1; j++) {
        result.push(j);
        startValues.add(j);
      }
    }
    return result;
  };
  // First of all, slots are sorted according to the proximity to the requested event time:
  const timeComparator = (a: number, b: number) =>
    Math.abs(startOffset - a) - Math.abs(startOffset - b);

  // Each room corresponds to array containing the start positions of free slots:
  const slotsByRooms = new Map<string, number[]>();
  for (const roomDef of rooms) {
    const day = dayTable[roomDef.id];
    const freeSlots = freeRooms.has(roomDef.id)
      ? // If room has a free slot for our event, then the search for other slots
        // should be performed outside this slot:
        [
          ...getSlots(day, 0, startOffset - 1),
          ...getSlots(day, endOffset + 1, RANGES_LEN + 1),
        ].sort(timeComparator)
      : getSlots(day, 0, RANGES_LEN + 1).sort(timeComparator);
    if (freeSlots.length) {
      slotsByRooms.set(roomDef.id, freeSlots);
    }
  }

  const roomCards: RoomCard[] = [];
  // Closest slots are selected from the sorted rooms:
  const sortedStartValues = Array.from(startValues).sort(timeComparator);
  main: for (const min of sortedStartValues) {
    for (const [roomId, roomSlots] of slotsByRooms) {
      if (roomSlots.includes(min)) {
        const [startTime, endTime] = rangeToTime(min, min + eventLength - 1);
        roomCards.push({
          ...rooms.find(r => r.id === roomId)!,
          startTime,
          endTime,
        });
        if (roomCards.length === resultLength) {
          break main;
        }
      }
    }
  }
  return roomCards;
}

export function useRecommendation(
  { startTime, endTime, date, users }: StateValues<FormFields>,
  isRecommendationNeeded: boolean,
  eventsToMove: MutableRefObject<EventToMove[]>
) {
  const { data } = useQuery<Query>(gql`
    {
      ${ROOMS_QUERY}
      ${EVENTS_MAP_QUERY}
      ${TABLE_QUERY}
    }
  `);

  return useMemo<RoomCard[]>(() => {
    if (
      !data ||
      !isRecommendationNeeded ||
      ![date, endTime, startTime, users].every(Boolean)
    ) {
      return [];
    }

    const { rooms: allRooms, eventsMap: allEvents, table } = data;
    const formUsersFloors = users!.map(u => u.homeFloor);
    const roomDistanceComp = <T extends RoomCard | RoomData>(a: T, b: T) =>
      measureDistanceToRoom(a, formUsersFloors) - measureDistanceToRoom(b, formUsersFloors);

    const capableRooms = allRooms
      .filter(room => (room.maxCapacity ?? Infinity) >= users!.length)
      .sort(roomDistanceComp);
    const dayTable = table.get(date!.getTime());
    // All rooms are free:
    if (!dayTable) {
      return capableRooms.map(room => ({ ...room, startTime, endTime })).slice(0, 5);
    }

    const searchResult = findFreeRooms(
      startTime,
      endTime,
      dayTable,
      users!.length,
      capableRooms,
      allEvents
    );
    if (Array.isArray(searchResult)) {
      return searchResult;
    }
    let { freeRooms } = searchResult;
    const { candidateRooms, eventsFromCandidates } = searchResult;

    let freeRoomsIds = new Set(freeRooms.map(room => room.id));
    const movedRoomsComp = (moved: RoomMovedEvents) => (a: RoomCard, b: RoomCard) =>
      measureDistanceToNewRoom(a, moved, allEvents, formUsersFloors) -
      measureDistanceToNewRoom(b, moved, allEvents, formUsersFloors);

    // Trying to move conflicting meetings out of candidate rooms:
    const [releasedRooms, movedEvents] = moveConflictingEvents(
      candidateRooms,
      eventsFromCandidates,
      freeRoomsIds,
      dayTable,
      allRooms,
      allEvents,
      movedRoomsComp
    );
    eventsToMove.current = Array.from(movedEvents.values())
      .flat()
      .map(event => ({
        ...event,
        prevRoom: allEvents.get(event.id)!.room.id,
      }));
    freeRooms = [...freeRooms, ...releasedRooms].sort(
      (a: RoomCard, b: RoomCard) =>
        measureDistanceToAnyRoom(a, movedEvents, allEvents, formUsersFloors) -
        measureDistanceToAnyRoom(b, movedEvents, allEvents, formUsersFloors)
    );
    if (freeRooms.length === 5 || freeRooms.length === capableRooms.length) {
      return freeRooms;
    }

    const [startOffset, endOffset] = timeToRange(startTime, endTime);
    freeRoomsIds = new Set(freeRooms.map(room => room.id));
    return freeRooms.concat(
      findAnotherTime(startOffset, endOffset, freeRoomsIds, dayTable, capableRooms)
    );
  }, [data, isRecommendationNeeded, date, endTime, startTime, users, eventsToMove]);
}
