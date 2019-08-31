import { createContext } from 'react';
import { Event } from 'components/timesheet/types';

export type PageType = 'add' | 'edit' | null;
export type PageData = Partial<Event>;

export type PageFn = (pageType: PageType, pageData?: PageData) => void;

export default createContext<PageFn>(() => {});
