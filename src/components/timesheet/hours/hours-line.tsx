import React, { memo, useState, useEffect } from 'react';
import { isSameDay, isBefore, getHours, getMinutes } from 'date-fns/esm';
import cn from 'classnames';

import { HOURS, dateToTimeString, RANGES_LEN } from 'service/dates';
import { useCurrentTime } from './use-current-time';
import { useSizeCtx, Size } from 'context/size-context';
import cls from './hours-line.module.scss';

type Props = {
  displayedDate: Date;
};

const TIME_PERCENTAGE_COEF = 100 / (30 + 15 * RANGES_LEN + 30); // timesheet length in minutes

export const HoursLine = memo(({ displayedDate }: Props) => {
  const size = useSizeCtx() ?? Size.DEFAULT;
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
        const minsFromStart = (currentHour - (HOURS[0] - 0.5)) * 60 + currentMinute;
        setOffset(minsFromStart * TIME_PERCENTAGE_COEF);
      }
    }
  }, [displayedDate, now]);

  function renderHourBadge(hour: number, index: number) {
    const renderedDate = new Date(displayedDate.getTime());
    renderedDate.setHours(hour, 0, 0, 0);
    const className = cn(cls.hour, {
      [cls.overpast]: isBefore(renderedDate, now),
    });
    return (
      <div key={hour} className={className}>
        <span className={cls.hourBadge}>{index === 0 ? hour + ':00' : hour}</span>
      </div>
    );
  }
  function renderCurrentTime() {
    if (!isSameDay(displayedDate, now)) {
      return null;
    }
    return (
      <div key="current" className={cls.currentTime} style={{ left: `${offset}%` }}>
        <span className={cls.currentTimeBadge}>{dateToTimeString(now)}</span>
      </div>
    );
  }

  return (
    <div className={cn(cls.hoursLine, { [cls.lg]: size === Size.LARGE })}>
      {renderCurrentTime()}
      {HOURS.map(renderHourBadge)}
    </div>
  );
});
