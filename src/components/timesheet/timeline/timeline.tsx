import React, { useContext } from 'react';
import classNames from 'classnames';

import { Room } from './room/room';
import { FloorDefinition } from '../types';
import classes from './timeline.module.scss';
import sizeContext from 'context/size-context';

type Props = {
  floors?: FloorDefinition[];
};

export const Timeline = ({ floors = [] }: Props) => {
  const size = useContext(sizeContext) || 'default';
  return (
    <ul
      className={classNames(classes.floors, {
        [classes.lg]: size === 'large',
      })}
    >
      {floors.map(floor => {
        const { number, rooms = [] } = floor;
        return (
          <li key={number} className={classes.floor}>
            <h1 className={classes.floorName}>{number} ЭТАЖ</h1>
            <ul>
              {rooms.map(room => (
                <li key={room.name} className={classes.room}>
                  <Room data={room} size={size} />
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};
