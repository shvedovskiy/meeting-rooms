import { useEffect, useRef } from 'react';

type CallbackType = (...args: any[]) => any;

export function useInterval(cb: CallbackType, delay: number) {
  const savedCb = useRef<CallbackType>();

  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    function tick() {
      savedCb.current?.();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}
