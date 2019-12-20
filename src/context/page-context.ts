import { createContext, useContext } from 'react';

import { FormEvent } from 'components/timesheet/types';

export const enum PageModes {
  ADD = 'add',
  EDIT = 'edit',
}
export type PageMode = PageModes | null;
export type PageData = Partial<FormEvent>;

export type PageFn = (mode: PageMode, data?: PageData) => void;

const PageContext = createContext<PageFn>(() => {});

export function usePageCtx() {
  const context = useContext(PageContext);
  if (typeof context === 'undefined') {
    throw new Error('usePageCtx must be inside a Provider with a value');
  }
  return context;
}

export default PageContext.Provider;
