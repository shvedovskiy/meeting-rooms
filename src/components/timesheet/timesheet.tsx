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
import { useSizeCtx } from 'context/size-context';
import ScrollProvider from 'context/scroll-context';
import {
  EVENTS_QUERY,
  TABLE_QUERY,
  EventsQueryType,
  EVENTS_MAP_QUERY,
} from 'service/queries';
import { calculateTable } from './utils';
import classes from './timesheet.module.scss';

export const Timesheet = () => {
  const [dateShown, setDateShown] = useDay();
  const [scrolled, setScrolled] = useState(false);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const size = useSizeCtx() || 'default';

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
    if (size === 'large') {
      if (event.target.scrollLeft > 180 && !scrolled) {
        setScrolled(true);
        return;
      }
      if (event.target.scrollLeft <= 180 && scrolled) {
        setScrolled(false);
      }
    }
  }, 200);
  useEventListener('scroll', handleScroll, containerEl as HTMLElement);

  return (
    <div
      className={cn(classes.timesheet, {
        [classes.lg]: size === 'large',
      })}
      ref={el => setContainerEl(el)}
    >
      <div className={classes.dateSwitch}>
        <DateSwitch size={size} date={dateShown} onChange={setDateShown} />
      </div>
      <div className={classes.hours}>
        <HoursLine displayedDate={dateShown} />
      </div>
      <div className={classes.timelineContainer}>
        <ScrollProvider value={scrolled}>
          <Timeline date={dateShown} />
        </ScrollProvider>
        <div className={classes.asidePlaceholder}></div>
        <div className={classes.timesheetPlaceholder}></div>
      </div>
    </div>
  );
};
