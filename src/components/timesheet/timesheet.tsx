import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useThrottleCallback } from '@react-hook/throttle';
import useEventListener from '@use-it/event-listener';
import cn from 'classnames';
import gql from 'graphql-tag';

import { HoursLine } from './hours/hours-line';
import { DateSwitch } from './date-switch/date-switch';
import { Timeline } from './timeline/timeline';
import { useDay } from 'components/common/use-day';
import { useSizeCtx, Size } from 'context/size-context';
import ScrollProvider from 'context/scroll-context';
import {
  EVENTS_QUERY,
  TABLE_QUERY,
  EventsQueryType,
  EVENTS_MAP_QUERY,
} from 'service/apollo/queries';
import { calculateTable } from './utils';
import cls from './timesheet.module.scss';

export const Timesheet = () => {
  const [dateShown, setDateShown] = useDay();
  const [scrolled, setScrolled] = useState(false);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const size = useSizeCtx() ?? Size.DEFAULT;

  const { data: eventsData, client } = useQuery<EventsQueryType>(gql`
    query Events {
      ${EVENTS_QUERY}
    }
  `);

  useEffect(() => {
    const [table, eventsMap] = calculateTable(eventsData!.events);
    client.cache.writeQuery({
      query: gql`
        {
          ${TABLE_QUERY}
        }
      `,
      data: { table },
    });
    client.cache.writeQuery({
      query: gql`
        {
          ${EVENTS_MAP_QUERY}
        }
      `,
      data: { eventsMap },
    });
  }, [client.cache, eventsData]);

  const handleScroll = useThrottleCallback((event: any) => {
    const sidebarWidth = size === Size.LARGE ? 180 : 245;
    if (event.target.scrollLeft > sidebarWidth && !scrolled) {
      setScrolled(true);
      return;
    }
    if (event.target.scrollLeft <= sidebarWidth && scrolled) {
      setScrolled(false);
    }
  }, 200);
  useEventListener('scroll', handleScroll, containerEl as HTMLElement);

  return (
    <div
      className={cn(cls.timesheet, { [cls.lg]: size === Size.LARGE })}
      ref={el => setContainerEl(el)}
    >
      <div className={cls.dateSwitch}>
        <DateSwitch size={size} date={dateShown} onChange={setDateShown} />
      </div>
      <div className={cls.hours}>
        <HoursLine displayedDate={dateShown} />
      </div>
      <div className={cls.timelineContainer}>
        <ScrollProvider value={scrolled}>
          <Timeline date={dateShown} />
        </ScrollProvider>
        <div className={cls.asidePlaceholder}></div>
        <div className={cls.timesheetPlaceholder}></div>
      </div>
    </div>
  );
};
