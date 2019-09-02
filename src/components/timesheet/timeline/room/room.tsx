import React, { useContext, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import cn from 'classnames';

import {
  prepareRanges,
  formatCapacity,
  Slot,
  CommonSlot,
  offsetToTime,
} from './common';
import { Tooltip } from 'components/ui/tooltip/tooltip';
import { Card } from '../card/card';
import { RoomData, Event } from '../../types';
import { Size } from 'context/size-context';
import scrollContext from 'context/scroll-context';
import pageContext from 'context/page-context';
import { HOURS } from 'service/dates';
import { ROOM_EVENTS_QUERY, RoomEventsQueryType } from 'service/queries';
import classes from './room.module.scss';

type Props = {
  room: RoomData;
  size?: Size;
  date: Date;
};

export const Room = ({ room, size = 'default', date }: Props) => {
  const scrolled = useContext(scrollContext);
  const openPage = useContext(pageContext);
  const { data: eventsData = { roomEvents: [] } } = useQuery<
    RoomEventsQueryType
  >(ROOM_EVENTS_QUERY, {
    variables: { timestamp: date.getTime(), id: room.id },
  });
  const ranges = useMemo(() => prepareRanges(eventsData.roomEvents, HOURS[0]), [
    eventsData,
  ]);

  function openAddPage([startTime, endTime]: string[]) {
    const newEventData: Partial<Event> = {
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
          className={cn(classes.slot, classes[`slot--${width}`], classes.busy)}
        />
      );
      return (
        <Tooltip key={range.id} trigger={slot} position="bottom center">
          <Card
            room={room.title}
            data={eventInfo}
            onAction={openEditEventPage}
          />
        </Tooltip>
      );
    }
    return (
      <button
        key={index}
        className={cn(classes.slot, classes[`slot--${width}`])}
        onClick={() =>
          openAddPage(offsetToTime(HOURS[0], range.offset, range.width))
        }
      />
    );
  }

  return (
    <div
      className={cn(classes.room, {
        [classes.lg]: size === 'large',
        [classes.scrolled]: scrolled,
      })}
    >
      <div className={classes.timeline}>{ranges.map(renderSlot)}</div>
      <div
        className={cn(classes.roomInfo, {
          [classes.unavailable]: ranges.every(r => r.hasOwnProperty('id')),
        })}
      >
        <div className={classes.name}>{room.title}</div>
        <p className={classes.capacity}>
          {formatCapacity(room.minCapacity, room.maxCapacity)}
        </p>
      </div>
    </div>
  );
};
