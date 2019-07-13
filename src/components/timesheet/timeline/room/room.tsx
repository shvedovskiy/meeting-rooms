import React, { useContext, useMemo, useCallback } from 'react';
import classNames from 'classnames';

import { prepareRanges, formatCapacity } from './common';
import classes from './room.module.scss';
import { Size } from 'context/size-context';
import scrollContext from 'context/scroll-context';
import pageContext from 'context/page-context';
import { Tooltip } from 'components/ui/tooltip/tooltip';
import { Card } from '../card/card';
import { RoomData } from '../../types';
import { HOURS } from '../../common';

type Props = {
  data: RoomData;
  size?: Size;
};

export const Room = ({ data, size = 'default' }: Props) => {
  const { events = [] } = data;
  const scrolled = useContext(scrollContext);
  const openPage = useContext(pageContext);
  const ranges = useMemo(() => prepareRanges(events, HOURS[0]), [events]);

  const createEvent = useCallback(() => {
    openPage('add');
  }, [openPage]);
  const editEvent = useCallback(() => {
    openPage('edit');
  }, [openPage]);

  function renderSlot(range: any, index: number) {
    const { width, ...eventInfo } = range;

    if (range.id) {
      const slot = (
        <button
          className={classNames(
            classes.slot,
            classes[`slot--${width}`],
            classes.busy
          )}
        />
      );
      return (
        <Tooltip key={range.id} trigger={slot} position="bottom center">
          <Card data={eventInfo} onAction={editEvent} />
        </Tooltip>
      );
    }
    return (
      <button
        key={index}
        className={classNames(classes.slot, classes[`slot--${width}`])}
        onClick={createEvent}
      />
    );
  }

  return (
    <div
      className={classNames(classes.room, {
        [classes.lg]: size === 'large',
        [classes.scrolled]: scrolled,
      })}
    >
      <div className={classes.timeline}>{ranges.map(renderSlot)}</div>
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
