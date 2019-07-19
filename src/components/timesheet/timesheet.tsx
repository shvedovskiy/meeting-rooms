import React, { useState, useContext } from 'react';
import { useThrottleCallback } from '@react-hook/throttle';
import useEventListener from '@use-it/event-listener';
import classNames from 'classnames';
import { startOfDay } from 'date-fns/esm';

import { HoursLine } from './hours/hours-line';
import sizeContext from 'context/size-context';
import scrollContext from 'context/scroll-context';
import classes from './timesheet.module.scss';
import { DateSwitch } from './date-switch/date-switch';
import { Timeline } from './timeline/timeline';
import { Table, FloorDefinition } from './types';
import { useDay } from 'components/utils/use-day';
import { users, rooms } from './common';

const floors: FloorDefinition[] = [
  {
    floor: 1,
    rooms: [...rooms],
  },
];
const now = startOfDay(new Date());
const table: Table = new Map([
  [
    now.getTime(),
    {
      'Room 2': [
        {
          id: '1342134123',
          title: 'Event Name',
          date: now,
          startTime: '10:00',
          endTime: '14:00',
          participants: [users[0], users[1]],
          room: rooms[0],
        },
        {
          id: 'sdd',
          title: 'Event Name',
          date: now,
          startTime: '14:45',
          endTime: '15:45',
          room: rooms[1],
        },
      ],
    },
  ],
]);

export const Timesheet = () => {
  const [dateShown, setDateShown] = useDay();
  const [scrolled, setScrolled] = useState(false);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const size = useContext(sizeContext) || 'default';

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
          <Timeline
            floors={floors}
            tableData={table.get(dateShown.getTime())}
            date={dateShown}
          />
        </scrollContext.Provider>
        <div className={classes.asidePlaceholder}></div>
        <div className={classes.timesheetPlaceholder}></div>
      </div>
    </div>
  );
};
