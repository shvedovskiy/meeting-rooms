export type Nullable<T> = T | null | undefined;

type ObjectKeyType = string | number | symbol;

type Diff<T extends ObjectKeyType, U extends ObjectKeyType> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

export type Override<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;
