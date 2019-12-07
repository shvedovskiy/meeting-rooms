import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import cn from 'classnames';
import gql from 'graphql-tag';

import { Room } from './room/room';
import classes from './timeline.module.scss';
import { useSizeCtx } from 'context/size-context';
import { useScrollCtx } from 'context/scroll-context';
import { ROOMS_QUERY, RoomsQueryType } from 'service/apollo/queries';
import { RoomData, FloorDefinition } from '../types';

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
  const size = useSizeCtx() ?? 'default';
  const scrolled = useScrollCtx();
  const { data: roomsData } = useQuery<RoomsQueryType>(gql`
    query Rooms {
      ${ROOMS_QUERY}
    }
  `);

  const floors = generateFloorsTable(roomsData!.rooms);

  function renderRooms() {
    if (floors.size === 0) {
      return <li className={classes.roomPlaceholder}>Комнат нет</li>;
    }

    const components: JSX.Element[] = [];
    for (const [floorNumber, rooms] of floors) {
      components.push(
        <li key={floorNumber} className={classes.floor}>
          <h1
            className={cn(classes.floorName, { [classes.scrolled]: scrolled })}
            title={`${floorNumber} этаж`}
          >
            {floorNumber} ЭТАЖ
          </h1>
          <ul>
            {rooms.map(room => (
              <li key={room.title} className={classes.room}>
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
    <ul
      className={cn(classes.floors, {
        [classes.lg]: size === 'large',
      })}
    >
      {renderRooms()}
    </ul>
  );
};
