import { useState, useCallback } from 'react';
import { startOfDay } from 'date-fns/esm';

export function useDay(): [Date, (date: Date) => void] {
  const [value, setValue] = useState(startOfDay(new Date()));

  const setStartDayValue = useCallback(
    (date: Date) => {
      setValue(startOfDay(date));
    },
    [setValue]
  );

  return [value, setStartDayValue];
}
