import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Popover, { ArrowContainer, PopoverInfo } from 'react-tiny-popover';
import cn from 'classnames';

import { prepareRanges, formatCapacity, Slot, CommonSlot, offsetToTime } from './room-utils';
import { Card } from '../card/card';
import { RoomData, Event } from '../../types';
import { useKeydown } from 'components/common/use-keydown';
import { Size } from 'context/size-context';
import { useScrollCtx } from 'context/scroll-context';
import { usePageCtx, PageModes } from 'context/page-context';
import { HOURS } from 'service/dates';
import { ROOM_EVENTS_QUERY, RoomEventsQueryType } from 'service/apollo/queries';
import classes from './room.module.scss';

type Props = {
  room: RoomData;
  size?: Size;
  date: Date;
};

export const Room = ({ room, size = Size.DEFAULT, date }: Props) => {
  const [openedTooltip, setOpenedTooltip] = useState<string | null>(null);
  const scrolled = useScrollCtx();
  const openPage = usePageCtx();
  const closeTooltip = useCallback(() => setOpenedTooltip(null), []);

  useKeydown('Escape', () => {
    if (openedTooltip != null) {
      closeTooltip();
    }
  });
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
    openPage(PageModes.ADD, {
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
      openPage(PageModes.EDIT, {
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
      const popoverContent = ({ position, targetRect, popoverRect }: PopoverInfo) => (
        <ArrowContainer
          position={position}
          targetRect={targetRect}
          popoverRect={popoverRect}
          arrowColor="var(--bg-primary)"
          arrowSize={8}
          arrowStyle={{ zIndex: 1 }}
        >
          <Card
            room={room.title}
            data={eventInfo}
            onAction={(event: Event) => {
              closeTooltip();
              openEditEventPage(event);
            }}
          />
        </ArrowContainer>
      );
      const slot = (
        <button
          className={cn(classes.slot, classes[`slot--${width}`], classes.busy)}
          onClick={() => setOpenedTooltip(t => (t === range.id ? null : range.id))}
        />
      );
      return (
        <Popover
          key={range.id}
          isOpen={openedTooltip === range.id}
          position={['bottom', 'top', 'right', 'left']}
          padding={-8}
          windowBorderPadding={0}
          content={popoverContent}
          containerStyle={{ overflow: 'visible' }}
          transitionDuration={0.2}
          onClickOutside={closeTooltip}
        >
          {slot}
        </Popover>
      );
    }
    return (
      <button
        key={index}
        className={cn(classes.slot, classes[`slot--${width}`])}
        title="Создать событие"
        onClick={() => openAddPage(offsetToTime(HOURS[0], range.offset, range.width))}
      />
    );
  }

  const roomCapacity = formatCapacity(room.minCapacity, room.maxCapacity);
  return (
    <div
      className={cn(classes.room, {
        [classes.lg]: size === Size.LARGE,
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
