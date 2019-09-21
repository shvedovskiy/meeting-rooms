import { createContext } from 'react';

import { Event } from 'components/timesheet/types';

export type PageMode = 'add' | 'edit' | null;
export type PageData = Event | Partial<Event>;

export type PageFn = (mode: PageMode, data?: PageData) => void;

export default createContext<PageFn>(() => {});
