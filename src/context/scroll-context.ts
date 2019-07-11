import { createContext } from 'react';

export type Scrolled = boolean;

export default createContext<Scrolled>(false);
