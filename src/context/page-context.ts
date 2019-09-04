import { createContext } from 'react';

import { Event } from 'components/timesheet/types';
import { Props as ModalDef } from 'components/ui/modal/modal';

export type PageType = 'add' | 'edit' | null;
export type PageData = Partial<Event>;

export type PageFn = (pageType: PageType, pageData?: PageData) => void;
export type ModalFn = (modalDef: ModalDef | null) => void;

export default createContext<[PageFn, ModalFn]>([() => {}, () => {}]);
