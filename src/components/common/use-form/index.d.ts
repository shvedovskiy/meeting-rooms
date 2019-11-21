import { FocusEventHandler } from 'react';

type StateShape<T> = { [key in keyof T]: any };
type StateErrors<E> = { [key in keyof E]?: string };

interface UseForm {
  <T extends StateShape<T>, E extends StateErrors<E>>(
    initialState?: Partial<T> | null,
    formOptions?: {
      onChange?: (newValues: Partial<T>, state: StateValues<T>) => Partial<T>;
      onBlur?: FocusEventHandler<HTMLElement>;
      onTouched?: FocusEventHandler<HTMLElement>;
      submitValidator?: (formValues: StateValues<T>) => Partial<E>;
    }
  ): [FormState<T, E>, Inputs<T>];
}

export const useForm: UseForm;

interface FormState<T, E> {
  values: StateValues<T>;
  validity: StateValidity<E>;
  touched: StateValidity<T>;
  validators: StateValidators<T>;
  errors: E;
}

type Validator<T, Name extends keyof T = keyof T> = (
  value: StateValues<T>[Name],
  formValues: StateValues<T>
) => any;

type StateValues<T> = {
  readonly [A in keyof T]: T[A] extends number ? string : T[A];
};
type StateValidity<T> = { readonly [A in keyof T]: boolean | undefined };
type StateValidators<T> = { readonly [A in keyof T]?: Validator<T> };

interface Inputs<T, Name extends keyof T = keyof T> {
  field<RawValue, Name extends keyof T = keyof T>(
    options: FieldOptions<T, Name, RawValue>
  ): FieldProps<T, Name, RawValue>;
  form<F>(options: FormOptions<F>): FormProps;
}

interface FieldOptions<T, Name extends keyof T, RawValue> {
  name: Name;
  touchOnChange?: boolean;
  validate?: Validator<T, Name>;
  validateOnBlur?: Validator<T, Name>;
  onChange?(rawValue: RawValue): StateValues<T>[Name];
  onBlur?(...args: any[]): void;
}

interface FormOptions<F> {
  name: string;
  onSubmit?(values: F): void;
}

interface FieldProps<T, Name extends keyof T, RawValue> {
  name: Extract<Name, string>;
  value: StateValues<T>[Name];
  onChange(rawValue: RawValue): any;
  onBlur(...args: any[]): any;
}

interface FormProps {
  onSubmit(...args: any[]): any;
}
