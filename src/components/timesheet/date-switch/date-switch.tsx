import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { format, isToday, addDays, subDays } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import { Calendar } from 'components/ui/calendar/calendar';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Button } from 'components/ui/button/button';
import { Size } from 'context/size-context';
import classes from './date-switch.module.scss';

type Props = {
  date: Date;
  size?: Size;
  onChange?: (date: Date) => void;
};

export const DateSwitch = (props: Props) => {
  const { date, size = 'default', onChange } = props;
  const [calendarVisible, setCalendarVisible] = useState(false);

  const handleDayChange = useCallback(
    (nextDirection: boolean) => {
      if (onChange) {
        const newDate = nextDirection ? addDays(date, 1) : subDays(date, 1);
        onChange(newDate);
      }
    },
    [date, onChange]
  );

  const handleCalendarToggle = useCallback(() => {
    setCalendarVisible(v => !v);
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      handleCalendarToggle();
      if (onChange) {
        onChange(date);
      }
    },
    [handleCalendarToggle, onChange]
  );

  const dateString = isToday(date)
    ? format(date, 'd MMM', { locale: ruLocale }).slice(0, -1) +
      '\u00A0·\u00A0Сегодня'
    : format(date, 'd MMMM', { locale: ruLocale });
  return (
    <>
      <div
        className={cn(classes.dateSwitch, {
          [classes.lg]: size === 'large',
        })}
      >
        <IconButton
          icon="chevron"
          size={size}
          className={classes.switchBtn}
          disabled={isToday(date)}
          ariaLabel="Предыдущий день"
          onClickArgs={[false]}
          onClick={handleDayChange}
        />
        <Button
          use="borderless"
          className={classes.dateBtn}
          onClick={handleCalendarToggle}
        >
          {dateString}
        </Button>
        <IconButton
          icon="chevron"
          size={size}
          className={cn(classes.switchBtn, classes.next)}
          ariaLabel="Следующий день"
          onClickArgs={[true]}
          onClick={handleDayChange}
        />
      </div>
      <div className={classes.calendarContainer}>
        {calendarVisible && (
          <Calendar
            className={classes.calendar}
            initialDate={date}
            onBlur={() => setCalendarVisible(false)}
            onChange={handleDateSelect}
          />
        )}
      </div>
    </>
  );
};
