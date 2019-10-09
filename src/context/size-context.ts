import { createContext, useContext } from 'react';

export type Size = 'default' | 'large';

const SizeContext = createContext<Size>('default');

export function useSizeCtx() {
  const context = useContext(SizeContext);
  if (!context) {
    throw new Error('useSizeCtx must be inside a Provider with a value');
  }
  return context;
}

export default SizeContext.Provider;
