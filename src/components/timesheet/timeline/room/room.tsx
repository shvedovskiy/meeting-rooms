import React, { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import cn from 'classnames';

import {
  prepareRanges,
  formatCapacity,
  Slot,
  CommonSlot,
  offsetToTime,
} from './room-utils';
import { Tooltip } from 'components/ui/tooltip/tooltip';
import { Card } from '../card/card';
import { RoomData, Event } from '../../types';
import { Size } from 'context/size-context';
import { useScrollCtx } from 'context/scroll-context';
import { usePageCtx } from 'context/page-context';
import { HOURS } from 'service/dates';
import { ROOM_EVENTS_QUERY, RoomEventsQueryType } from 'service/apollo/queries';
import classes from './room.module.scss';

type Props = {
  room: RoomData;
  size?: Size;
  date: Date;
};

export const Room = ({ room, size = 'default', date }: Props) => {
  const scrolled = useScrollCtx();
  const openPage = usePageCtx();
  let { data } = useQuery<RoomEventsQueryType>(ROOM_EVENTS_QUERY, {
    variables: { timestamp: date.getTime(), id: room.id },
  });

  if (!data) {
    data = { roomEvents: { ranges: [], events: new Map() } };
  }
  const { ranges: roomRanges, events: roomEvents } = data.roomEvents;
  const ranges = useMemo(() => prepareRanges(roomRanges, roomEvents), [
    roomEvents,
    roomRanges,
  ]);

  function openAddPage([startTime, endTime]: string[]) {
    openPage('add', {
      date,
      startTime,
      endTime,
      room: {
        ...room,
        startTime,
        endTime,
      },
    });
  }

  const openEditEventPage = useCallback(
    (eventData: Event) => {
      openPage('edit', {
        ...eventData,
        room: {
          ...eventData.room,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
        },
      });
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
        title="Создать событие"
        onClick={() =>
          openAddPage(offsetToTime(HOURS[0], range.offset, range.width))
        }
      />
    );
  }

  const roomCapacity = formatCapacity(room.minCapacity, room.maxCapacity);
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
        <div className={classes.name} title={room.title}>
          {room.title}
        </div>
        <p className={classes.capacity} title={roomCapacity}>
          {roomCapacity}
        </p>
      </div>
    </div>
  );
};
