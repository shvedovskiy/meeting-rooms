import { useEffect, MutableRefObject } from 'react';

export type OutsideClickHandler = (event: MouseEvent | TouchEvent) => any;

export function useOnclickOutside(
  element: HTMLElement | null | undefined,
  handler: OutsideClickHandler
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (element?.contains(event.target as HTMLElement)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, element]);
}
