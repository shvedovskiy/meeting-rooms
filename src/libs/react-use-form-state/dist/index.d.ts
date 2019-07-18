// Type definitions for react-use-form-state 0.10.4
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

type StateShape<T> = { [key in keyof T]: any };

interface UseFormStateHook {
  (
    initialState?: Partial<StateShape<any>> | null,
    options?: Partial<FormOptions<any>>
  ): [FormState<any>, Inputs<any>];

  <T extends StateShape<T>, E = StateErrors<T, string>>(
    initialState?: Partial<T> | null,
    options?: Partial<FormOptions<T>>
  ): [FormState<T, E>, Inputs<T>];
}

export const useFormState: UseFormStateHook;

type SetFieldsOptions<T> = {
  touched?: StateValidity<T>;
  validity?: StateValidity<T>;
  errors?: StateErrors<T, string>;
};

interface FormState<T, E = StateErrors<T, string>> {
  values: StateValues<T>;
  validity: StateValidity<T>;
  touched: StateValidity<T>;
  errors: E;
  clear(): void;
  setField<K extends keyof T>(name: K, value: T[K]): void;
  setFields(
    fieldValues: StateValues<T> | null,
    options?: SetFieldsOptions<T>
  ): void;
  setFieldError(name: keyof T, error: string): void;
  clearField(name: keyof T): void;
}

interface FormOptions<T> {
  onChange(
    event: React.ChangeEvent<InputElement>,
    stateValues: StateValues<T>,
    nextStateValues: StateValues<T>
  ): void;
  onBlur(event: React.FocusEvent<InputElement>): void;
  onClear(): void;
  onTouched(event: React.FocusEvent<InputElement>): void;
}

// prettier-ignore
type StateValues<T> = {
  /**
   * Even though we're accepting a number as a default value for numeric inputs
   * (e.g. type=number and type=range), the value we store in  state for those
   * inputs will will be of a string
   */
  readonly [A in keyof T]: T[A] extends number ? string : T[A]
};

type StateValidity<T> = { readonly [A in keyof T]: Maybe<boolean> };

type StateErrors<T, E = string> = { readonly [A in keyof T]?: E | string };

// Inputs

type Inputs<T, Name extends keyof T = keyof T> = <
  RawValue,
  Name extends keyof T = keyof T
>(
  options: RawInputOptions<T, Name, RawValue>
) => RawInputProps<T, Name, RawValue>;

interface RawInputOptions<T, Name extends keyof T, RawValue> {
  name: Name;
  validateOnBlur?: boolean;
  touchOnChange?: boolean;
  validate?(
    value: StateValues<T>[Name],
    values: StateValues<T>,
    formState: FormState<T>,
    rawValue: RawValue
  ): any;
  onChange?(rawValue: RawValue): StateValues<T>[Name];
  onBlur?(...args: any[]): void;
}

interface RawInputProps<T, Name extends keyof T, RawValue> {
  name: Extract<Name, string>;
  value: StateValues<T>[Name];
  onChange(rawValue: RawValue): any;
  onBlur(...args: any[]): any;
}

type Args<Name, Value = void> = [Name, Value];

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface BaseInputProps<T> {
  id: string;
  onChange(event: any): void;
  onBlur(event: any): void;
  value: string;
  name: Extract<keyof T, string>;
  type: string;
}

// Utils

type Maybe<T> = T | undefined;
