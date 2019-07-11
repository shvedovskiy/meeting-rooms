import React, { useContext } from 'react';
import classNames from 'classnames';

import { RoomData, prepareRanges, formatCapacity } from './common';
import classes from './room.module.scss';
import { Size } from 'context/size-context';
import scrollContext from 'context/scroll-context';

type Props = {
  data: RoomData;
  startHour?: number;
  size?: Size;
};

export const Room = ({ data, startHour = 8, size = 'default' }: Props) => {
  const { events = [] } = data;
  const scrolled = useContext(scrollContext);
  const ranges = prepareRanges(events, startHour);

  return (
    <div
      className={classNames(classes.room, {
        [classes.lg]: size === 'large',
        [classes.scrolled]: scrolled,
      })}
    >
      <div className={classes.timeline}>
        {ranges.map((r, index) => {
          return (
            <button
              key={index}
              className={classNames(
                classes.slot,
                classes.busy,
                classes[`slot--${r}`]
              )}
            />
          );
        })}
      </div>
      <div
        className={classNames(classes.roomInfo, {
          [classes.unavailable]: !data.available,
        })}
      >
        <div className={classes.name}>{data.name}</div>
        <p className={classes.capacity}>{formatCapacity(data.capacity)}</p>
      </div>
    </div>
  );
};
