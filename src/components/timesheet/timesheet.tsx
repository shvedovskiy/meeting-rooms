import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { HoursLine } from './hours/hours-line';
import sizeContext from 'context/size-context';
import classes from './timesheet.module.scss';
import { DateSwitch } from './date-switch/date-switch';

export const Timesheet = () => {
  const [dateShown, setDateShown] = useState(new Date());
  const size = useContext(sizeContext) || 'default';

  return (
    <main
      className={classNames(classes.timesheet, {
        [classes.lg]: size === 'large',
      })}
    >
      <div className={classes.dateSwitch}>
        <DateSwitch size={size} date={dateShown} onChange={setDateShown} />
      </div>
      <div className={classes.hours}>
        <HoursLine displayedDate={dateShown} />
      </div>
      <aside className={classes.floors}></aside>
      <div className={classes.timelines}></div>
    </main>
  );
};
