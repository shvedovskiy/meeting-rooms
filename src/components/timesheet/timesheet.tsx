import React, { useState, useContext } from 'react';
import { useThrottleCallback } from '@react-hook/throttle';
import useEventListener from '@use-it/event-listener';
import classNames from 'classnames';

import { HoursLine } from './hours/hours-line';
import sizeContext from 'context/size-context';
import scrollContext from 'context/scroll-context';
import classes from './timesheet.module.scss';
import { DateSwitch } from './date-switch/date-switch';
import { Timeline } from './timeline/timeline';

const floors = [
  {
    number: 1,
    rooms: [
      {
        name: 'Room 1',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: false,
      },
      {
        name: 'Room 2',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: true,
      },
      {
        name: 'Room 3',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: true,
      },
    ],
  },
  {
    number: 2,
    rooms: [
      {
        name: 'Room 1',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: false,
      },
      {
        name: 'Room 2',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: true,
      },
      {
        name: 'Room 3',
        capacity: new Map([['min', 3], ['max', 6]]),
        available: true,
      },
    ],
  },
];

export const Timesheet = () => {
  const [dateShown, setDateShown] = useState(new Date());
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
    <main
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
          <Timeline floors={floors} />
        </scrollContext.Provider>
        <div className={classes.asidePlaceholder}></div>
        <div className={classes.timesheetPlaceholder}></div>
      </div>
    </main>
  );
};
