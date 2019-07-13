/// <reference types="react-scripts" />

declare module '@react-hook/throttle' {
  function useThrottleCallback(
    fn: any,
    fps?: number,
    leading?: boolean
  ): (...args: any[]) => void;
}

declare module 'pluralize-ru' {
  function pluralize(
    i: number,
    str0: string,
    str1: string,
    str2: string,
    str3: string
  ): string;
  export = pluralize;
}
