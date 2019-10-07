import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { isSameDay, isBefore, getHours, getMinutes } from 'date-fns/esm';

import { HOURS, dateToTimeString, RANGES_LEN } from 'service/dates';
import classes from './hours-line.module.scss';
import { useCurrentTime } from './use-current-time';

type Props = {
  displayedDate: Date;
};

const TIME_PERCENTAGE_COEF = 100 / (30 + 15 * RANGES_LEN + 30); // timesheet length in minutes

export const HoursLine = memo(({ displayedDate }: Props) => {
  const now = useCurrentTime(displayedDate);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isSameDay(displayedDate, now)) {
      const currentHour = getHours(now);
      const currentMinute = getMinutes(now);

      if (currentHour <= HOURS[0]) {
        setOffset(3.125);
      } else if (currentHour >= HOURS[HOURS.length - 1]) {
        setOffset(96.875);
      } else {
        const minsFromStart =
          (currentHour - (HOURS[0] - 0.5)) * 60 + currentMinute;
        setOffset(minsFromStart * TIME_PERCENTAGE_COEF);
      }
    }
  }, [displayedDate, now]);

  function renderHourBadge(hour: number, index: number) {
    const renderedDate = new Date(displayedDate.getTime());
    renderedDate.setHours(hour, 0, 0, 0);
    const className = classNames(classes.hour, {
      [classes.overpast]: isBefore(renderedDate, now),
    });
    return (
      <div key={hour} className={className}>
        <span className={classes.hourBadge}>
          {index === 0 ? hour + ':00' : hour}
        </span>
      </div>
    );
  }
  function renderCurrentTime() {
    if (!isSameDay(displayedDate, now)) {
      return null;
    }
    return (
      <div
        key="current"
        className={classes.currentTime}
        style={{ left: `${offset}%` }}
      >
        <span className={classes.currentTimeBadge}>
          {dateToTimeString(now)}
        </span>
      </div>
    );
  }

  return (
    <div className={classes.hoursLine}>
      {renderCurrentTime()}
      {HOURS.map(renderHourBadge)}
    </div>
  );
});
