import { createContext, useContext } from 'react';

export type Scrolled = boolean;

const ScrollContext = createContext<Scrolled>(false);

export function useScrollCtx() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollCtx must be inside a Provider with a value');
  }
  return context;
}

export default ScrollContext.Provider;
