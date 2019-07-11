import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { format, isToday, addDays, subDays } from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import { IconButton } from 'components/ui/icon-button/icon-button';
import classes from './date-switch.module.scss';
import { Button } from 'components/ui/button/button';
import { Size } from 'context/size-context';
import { Calendar } from 'components/ui/calendar/calendar';

type Props = {
  date: Date;
  size?: Size;
  onChange?: (date: Date) => void;
};

export const DateSwitch = (props: Props) => {
  const { date, size = 'default', onChange } = props;
  const [calendarVisible, setCalendarVisible] = useState(false);

  const handleDateChange = useCallback(
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

  function handleCalendarChange(newDate: Date) {
    if (onChange) {
      onChange(newDate);
    }
  }

  const dateString =
    format(date, 'd MMM', { locale: ruLocale }).slice(0, -1) +
    (isToday(date) ? '\u00A0·\u00A0Сегодня' : '');
  return (
    <>
      <div
        className={classNames(classes.dateSwitch, {
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
          onClick={handleDateChange}
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
          className={classNames(classes.switchBtn, classes.next)}
          ariaLabel="Следующий день"
          onClickArgs={[true]}
          onClick={handleDateChange}
        />
      </div>
      <div className={classes.calendarContainer}>
        {calendarVisible && (
          <Calendar
            className={classes.calendar}
            initialDate={date}
            onChange={handleCalendarChange}
          />
        )}
      </div>
    </>
  );
};
