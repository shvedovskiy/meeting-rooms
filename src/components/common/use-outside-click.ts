import { useEffect, RefObject } from 'react';

export type OutsideClickHandler = (event: MouseEvent | TouchEvent) => any;

export function useOnclickOutside(
  ref: RefObject<HTMLElement>,
  handler: OutsideClickHandler
): void;
export function useOnclickOutside<Ref extends Record<string, any>>(
  ref: RefObject<Ref>,
  handler: OutsideClickHandler,
  property: keyof Ref
): void;
export function useOnclickOutside<Ref extends Record<string, any>>(
  ref: RefObject<HTMLElement | Ref>,
  handler: OutsideClickHandler,
  property?: keyof Ref
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refValue = ref.current;
      if (!refValue) {
        return;
      }
      let element: HTMLElement | null = null;
      if (refValue instanceof HTMLElement) {
        element = refValue;
      } else if (property && (refValue[property] as any) instanceof HTMLElement) {
        element = refValue[property];
      }
      if (element && !element.contains(event.target as HTMLElement)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, property, ref]);
}
