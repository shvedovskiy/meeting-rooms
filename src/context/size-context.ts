import { createContext } from 'react';

export type Size = 'default' | 'large';

export default createContext<Size>('default');
