import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import cn from 'classnames';

import { Room } from './room/room';
import classes from './timeline.module.scss';
import sizeContext from 'context/size-context';
import { FLOORS_QUERY, FloorsQueryType } from 'service/queries';

type Props = {
  date: Date;
};

export const Timeline = ({ date }: Props) => {
  const size = useContext(sizeContext) || 'default';
  const { data: floorsData } = useQuery<FloorsQueryType>(FLOORS_QUERY);

  function renderRooms() {
    const { floors } = floorsData!;
    if (!floors || !floors.size) {
      return <li className={classes.roomPlaceholder}>Комнат нет</li>;
    }

    const components: JSX.Element[] = [];
    for (let [floorNumber, rooms] of floors) {
      components.push(
        <li key={floorNumber} className={classes.floor}>
          <h1 className={classes.floorName}>{floorNumber} ЭТАЖ</h1>
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
