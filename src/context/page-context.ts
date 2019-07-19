import { createContext } from 'react';
import { Event, NewEvent } from 'components/timesheet/types';

export type PageType = 'add' | 'edit';
export type PageFn = (type: PageType | null, data?: Event | NewEvent) => void;

export default createContext<PageFn>(() => {});
