import { createContext } from 'react';
import { Event } from 'components/timesheet/types';

export type PageType = 'add' | 'edit';
export type PageFn = (type: PageType | null, data?: Event) => void;

export default createContext<PageFn>(() => {});
