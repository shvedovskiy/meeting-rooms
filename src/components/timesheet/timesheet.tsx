import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useThrottleCallback } from '@react-hook/throttle';
import useEventListener from '@use-it/event-listener';
import classNames from 'classnames';

import { HoursLine } from './hours/hours-line';
import { DateSwitch } from './date-switch/date-switch';
import { Timeline } from './timeline/timeline';
import { useDay } from 'components/utils/use-day';
import sizeContext from 'context/size-context';
import scrollContext from 'context/scroll-context';
import {
  EVENTS_QUERY,
  TABLE_QUERY,
  EventsQueryType as QueryType,
} from 'service/queries';
import { calculateTable } from './common';
import classes from './timesheet.module.scss';

export const Timesheet = () => {
  const [dateShown, setDateShown] = useDay();
  const [scrolled, setScrolled] = useState(false);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const size = useContext(sizeContext) || 'default';

  const { data: eventsData, client } = useQuery<QueryType>(EVENTS_QUERY);

  useEffect(() => {
    client.cache.writeQuery({
      query: TABLE_QUERY,
      data: {
        table: calculateTable(eventsData!.events),
      },
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
      className={classNames(classes.timesheet, {
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
        <scrollContext.Provider value={scrolled}>
          <Timeline date={dateShown} />
        </scrollContext.Provider>
        <div className={classes.asidePlaceholder}></div>
        <div className={classes.timesheetPlaceholder}></div>
      </div>
    </div>
  );
};
