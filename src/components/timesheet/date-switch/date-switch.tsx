import React, { useCallback, useState, useRef } from 'react';
import cn from 'classnames';
import { isToday, addDays, subDays } from 'date-fns/esm';

import { Calendar } from 'components/ui/calendar/calendar';
import { IconButton } from 'components/ui/icon-button/icon-button';
import { Button } from 'components/ui/button/button';
import { Size } from 'context/size-context';
import { format } from 'service/dates';
import { useKeydown } from 'components/common/use-keydown';
import cls from './date-switch.module.scss';

type Props = {
  date: Date;
  size?: Size;
  onChange?: (date: Date) => void;
};

export const DateSwitch = (props: Props) => {
  const { date, size = Size.DEFAULT, onChange } = props;
  const [calendarVisible, setCalendarVisible] = useState(false);
  const calendarBtn = useRef<HTMLButtonElement>(null);

  useKeydown('Escape', () => {
    if (calendarVisible) {
      setCalendarVisible(false);
    }
  });

  const handleDayChange = useCallback(
    (nextDirection: boolean) => {
      if (onChange) {
        const newDate = nextDirection ? addDays(date, 1) : subDays(date, 1);
        onChange(newDate);
      }
    },
    [date, onChange]
  );

  const toggleCalendar = useCallback(() => {
    setCalendarVisible(v => !v);
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      toggleCalendar();
      onChange?.(date);
    },
    [toggleCalendar, onChange]
  );

  const dateString = isToday(date)
    ? format(date, 'd MMM').slice(0, -1) + '\u00A0·\u00A0Сегодня'
    : format(date);
  return (
    <>
      <div className={cn(cls.dateSwitch, { [cls.lg]: size === Size.LARGE })}>
        <IconButton
          icon="chevron"
          size={size}
          className={cls.switchBtn}
          disabled={isToday(date)}
          ariaLabel="Предыдущий день"
          title="Предыдущий день"
          onClickArgs={[false]}
          onClick={handleDayChange}
        />
        <Button
          use="borderless"
          className={cls.dateBtn}
          ref={calendarBtn}
          onClick={toggleCalendar}
          title={dateString}
        >
          {dateString}
        </Button>
        <IconButton
          icon="chevron"
          size={size}
          className={cn(cls.switchBtn, cls.next)}
          ariaLabel="Следующий день"
          title="Следующий день"
          onClickArgs={[true]}
          onClick={handleDayChange}
        />
      </div>
      <div className={cls.calendarContainer}>
        {calendarVisible && (
          <Calendar
            className={cls.calendar}
            initialDate={date}
            onBlur={() => setCalendarVisible(false)}
            onClose={({ target }) => {
              if (target !== calendarBtn.current) {
                setCalendarVisible(false);
              }
            }}
            onChange={handleDateSelect}
          />
        )}
      </div>
    </>
  );
};
