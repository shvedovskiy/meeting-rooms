import { createContext, useContext } from 'react';

export const enum Size {
  DEFAULT = 'default',
  LARGE = 'large',
}
const SizeContext = createContext<Size>(Size.DEFAULT);

export function useSizeCtx() {
  const context = useContext(SizeContext);
  if (typeof context === 'undefined') {
    throw new Error('useSizeCtx must be inside a Provider with a value');
  }
  return context;
}

export default SizeContext.Provider;
