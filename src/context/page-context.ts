import { createContext, useContext } from 'react';

import { Event } from 'components/timesheet/types';

export type PageMode = 'add' | 'edit' | null;
export type PageData = Event | Partial<Event>;

export type PageFn = (mode: PageMode, data?: PageData) => void;

const PageContext = createContext<PageFn>(() => {});

export function usePageCtx() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageCtx must be inside a Provider with a value');
  }
  return context;
}

export default PageContext.Provider;
