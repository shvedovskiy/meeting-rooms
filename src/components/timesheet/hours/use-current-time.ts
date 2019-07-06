import { useState } from 'react';
import isSameDay from 'date-fns/isSameDay';

import { useInterval } from 'components/utils/use-interval';

const ONE_MINUTE = 60 * 1000; // ms

export function useCurrentTime(displayedDate: Date) {
  const [currentTime, setTime] = useState(new Date());

  useInterval(() => {
    const newTime = new Date();
    if (isSameDay(displayedDate, newTime)) {
      setTime(new Date());
    }
  }, ONE_MINUTE);

  return currentTime;
}
