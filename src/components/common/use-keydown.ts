import { useEffect } from 'react';

export function useKeydown(targetKey: string, handler: (event: KeyboardEvent) => any) {
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === targetKey) {
        handler(event);
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [handler, targetKey]);
}
