import React, { useContext } from 'react';
import classNames from 'classnames';

import { Room } from './room/room';
import { FloorDefinition, RoomEvents } from '../types';
import classes from './timeline.module.scss';
import sizeContext from 'context/size-context';

type Props = {
  floors?: FloorDefinition[];
  tableData?: RoomEvents;
  date: Date;
};

export const Timeline = ({ floors = [], tableData = {}, date }: Props) => {
  const size = useContext(sizeContext) || 'default';
  return (
    <ul
      className={classNames(classes.floors, {
        [classes.lg]: size === 'large',
      })}
    >
      {floors.map(floor => {
        const { floor: floorNumber, rooms = [] } = floor;
        return (
          <li key={floorNumber} className={classes.floor}>
            <h1 className={classes.floorName}>{floorNumber} ЭТАЖ</h1>
            <ul>
              {rooms.map(room => (
                <li key={room.title} className={classes.room}>
                  <Room
                    room={room}
                    events={tableData[room.id]}
                    date={date}
                    size={size}
                  />
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};
