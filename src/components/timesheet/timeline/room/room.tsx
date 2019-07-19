import React, { useContext, useMemo, useCallback } from 'react';
import classNames from 'classnames';

import {
  prepareRanges,
  formatCapacity,
  Slot,
  CommonSlot,
  offsetToTime,
} from './common';
import classes from './room.module.scss';
import { Size } from 'context/size-context';
import scrollContext from 'context/scroll-context';
import pageContext from 'context/page-context';
import { Tooltip } from 'components/ui/tooltip/tooltip';
import { Card } from '../card/card';
import { RoomData, Event, NewEvent } from '../../types';
import { HOURS } from '../../common';

type Props = {
  room: RoomData;
  events?: Event[];
  size?: Size;
  date: Date;
};

export const Room = ({ room, events = [], size = 'default', date }: Props) => {
  const scrolled = useContext(scrollContext);
  const openPage = useContext(pageContext);
  const ranges = useMemo(() => prepareRanges(events, HOURS[0]), [events]);

  function openAddPage([startTime, endTime]: string[]) {
    const newEventData: NewEvent = {
      date,
      startTime,
      endTime,
      room,
    };
    openPage('add', newEventData);
  }
  const openEditEventPage = useCallback(
    (eventData: Event) => {
      openPage('edit', eventData);
    },
    [openPage]
  );

  function renderSlot(
    range: Slot | CommonSlot,
    index: number
  ): React.ReactElement | React.ReactHTMLElement<HTMLButtonElement>;
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
          <Card
            room={room.name}
            data={eventInfo}
            onAction={openEditEventPage}
          />
        </Tooltip>
      );
    }
    return (
      <button
        key={index}
        className={classNames(classes.slot, classes[`slot--${width}`])}
        onClick={() =>
          openAddPage(offsetToTime(HOURS[0], range.offset, range.width))
        }
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
          [classes.unavailable]: !room.available,
        })}
      >
        <div className={classes.name}>{room.name}</div>
        <p className={classes.capacity}>{formatCapacity(room.capacity)}</p>
      </div>
    </div>
  );
};
