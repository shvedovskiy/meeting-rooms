import { createContext } from 'react';

export type SizeContextType = 'default' | 'large';

export default createContext<SizeContextType | undefined>(undefined);
