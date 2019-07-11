import React, { useContext } from 'react';
import classNames from 'classnames';

import { Room } from './room/room';
import { RoomData } from './room/common';
import classes from './timeline.module.scss';
import sizeContext from 'context/size-context';

type Props = {
  floors?: {
    number: number;
    rooms: RoomData[];
  }[];
  startHour?: number;
};

export const Timeline = ({ floors = [] }: Props) => {
  const size = useContext(sizeContext) || 'default';

  return (
    <ul
      className={classNames(classes.floors, {
        [classes.lg]: size === 'large',
      })}
    >
      {floors.map(floor => (
        <li key={floor.number} className={classes.floor}>
          <h1 className={classes.floorName}>{floor.number} ЭТАЖ</h1>
          <ul>
            {floor.rooms.map(room => (
              <li key={room.name} className={classes.room}>
                <Room data={room} size={size} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
