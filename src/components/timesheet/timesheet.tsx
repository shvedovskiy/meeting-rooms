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
import { Table, UserData, RoomData, FloorDefinition } from './types';
import { useDay } from 'components/utils/use-day';

import { startOfDay, addDays } from 'date-fns/esm';

const users: UserData[] = [
  {
    id: '3434',
    login: 'Первый участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:5000/a',
  },
  {
    id: '343цук4',
    login: 'Второй участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:5000/a',
  },
];
const rooms: RoomData[] = [
  {
    id: 'Room 1',
    name: 'Room 1',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: false,
  },
  {
    id: 'Room 2',
    name: 'Room 2',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: true,
  },
  {
    id: 'Room 3',
    name: 'Room 3',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: true,
  },
];
const floors: FloorDefinition[] = [
  {
    floor: 1,
    rooms: [...rooms],
  },
];
const now = addDays(startOfDay(new Date()), 1);
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
        },
        {
          id: 'sdd',
          title: 'Event Name',
          date: now,
          startTime: '14:45',
          endTime: '15:45',
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
          />
        </scrollContext.Provider>
        <div className={classes.asidePlaceholder}></div>
        <div className={classes.timesheetPlaceholder}></div>
      </div>
    </div>
  );
};
