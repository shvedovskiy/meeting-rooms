import { createContext } from 'react';

export type PageType = 'add' | 'edit';
export type PageFn = (page: PageType) => void;

export default createContext<PageFn>(() => {});
