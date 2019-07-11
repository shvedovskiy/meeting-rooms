/// <reference types="react-scripts" />

declare module '@react-hook/throttle' {
  function useThrottleCallback(
    fn: any,
    fps?: number,
    leading?: boolean
  ): (...args: any[]) => void;
}
