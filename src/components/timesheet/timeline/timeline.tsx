import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cn from 'classnames';

import { Room } from './room/room';

import { useSizeCtx, Size } from 'context/size-context';
import { useScrollCtx } from 'context/scroll-context';
import { ROOMS_QUERY, RoomsQueryType } from 'service/apollo/queries';
import { RoomData, FloorDefinition } from '../types';
import cls from './timeline.module.scss';

type Props = {
  date: Date;
};

function generateFloorsTable(rooms: RoomData[]): FloorDefinition {
  const floors: FloorDefinition = new Map();

  for (const room of rooms) {
    if (floors.has(room.floor)) {
      floors.get(room.floor)!.push(room);
    } else {
      floors.set(room.floor, [room]);
    }
  }
  return new Map([...floors].sort((r1, r2) => r1[0] - r2[0]));
}

export const Timeline = ({ date }: Props) => {
  const size = useSizeCtx() ?? Size.DEFAULT;
  const scrolled = useScrollCtx();
  const { data: roomsData } = useQuery<RoomsQueryType>(gql`
    query Rooms {
      ${ROOMS_QUERY}
    }
  `);

  const floors = generateFloorsTable(roomsData!.rooms);

  function renderRooms() {
    if (floors.size === 0) {
      return <li className={cls.roomPlaceholder}>Комнат нет</li>;
    }

    const components: JSX.Element[] = [];
    for (const [floorNumber, rooms] of floors) {
      components.push(
        <li key={floorNumber} className={cls.floor}>
          <h1
            className={cn(cls.floorName, { [cls.scrolled]: scrolled })}
            title={`${floorNumber} этаж`}
          >
            {floorNumber} ЭТАЖ
          </h1>
          <ul>
            {rooms.map(room => (
              <li key={room.title} className={cls.room}>
                <Room room={room} date={date} size={size} />
              </li>
            ))}
          </ul>
        </li>
      );
    }
    return components;
  }

  return (
    <ul className={cn(cls.floors, { [cls.lg]: size === Size.LARGE })}>{renderRooms()}</ul>
  );
};
