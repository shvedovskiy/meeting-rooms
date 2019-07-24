import { useCache } from './use-cache';
import { useState } from './use-form-state';

const ON_CHANGE_HANDLER = 0;
const ON_BLUR_HANDLER = 1;
const ON_SUBMIT_HANDLER = 2;

const defaultFormOptions = {
  onChange() {},
  onBlur() {},
  onTouched() {},
  onClear() {},
};

const defaultInputOptions = {
  onChange(v) {
    return v;
  },
  onBlur() {},
  validate: null,
  validateOnBlur: false,
  touchOnChange: false,
};

function validate(fieldName, fieldValue, formValues, validator) {
  if (typeof validator === 'function') {
    const result = validator(fieldValue, formValues);
    if (result === true) {
      return [{ [fieldName]: true }, { [fieldName]: null }];
    }
    if (typeof result === 'string') {
      return [{ [fieldName]: false }, { [fieldName]: result }];
    }
    const validities = {};
    const errors = {};
    Object.entries(result).forEach(([name, fieldResult]) => {
      if (fieldResult === true) {
        validities[name] = true;
        errors[name] = null;
      } else if (typeof fieldResult === 'string') {
        validities[name] = false;
        errors[name] = fieldResult;
      }
    });
    return [validities, errors];
  }
  return [{ [fieldName]: true }, { [fieldName]: null }];
}

export function useForm(initialState, options) {
  const formOptions = { ...defaultFormOptions, ...options };

  const formState = useState(initialState);
  const { set: setDirty, has: isDirty } = useCache();
  const callbacks = useCache();

  const fieldProps = ({ name, ...options }) => {
    const inputOptions = {
      ...defaultInputOptions,
      ...options,
    };

    const hasValueInState = formState.current.values[name] !== undefined;
    const hasValidatorInState =
      !formState.current.validators ||
      formState.current.validators[name] !== undefined;

    const key = `${name}`;

    function setInitialValue() {
      formState.setValues({ [name]: '' });
    }

    function makeValidation(
      value = formState.current.values[name],
      values = formState.current.values
    ) {
      const [validities, errors] = validate(
        name,
        value,
        values,
        inputOptions.validate
      );
      formState.setValidity(validities);
      formState.setError(errors);
    }

    function touch(e) {
      if (!formState.current.touched[name]) {
        formState.setTouched({ [name]: true });
        formOptions.onTouched(e);
      }
    }

    return {
      get value() {
        // auto populating initial state values on first render
        if (!hasValueInState) {
          setInitialValue(formState);
        }

        if (
          typeof inputOptions.validate === 'function' &&
          !hasValidatorInState
        ) {
          formState.setValidator({ [name]: inputOptions.validate });
        }

        // auto populating default values of touched
        if (formState.current.touched[name] == null) {
          formState.setTouched({ [name]: false });
        }
        return hasValueInState ? formState.current.values[name] : '';
      },
      onChange: callbacks.getOrSet(ON_BLUR_HANDLER + key, e => {
        setDirty(name, true);
        let value = inputOptions.onChange(e);
        if (value === undefined) {
          // setting value to its current state if onChange does not return
          // value to prevent React from complaining about the input switching
          // from controlled to uncontrolled
          value = formState.current.values[name];
        }

        // Mark raw fields as touched on change, since we might not get an
        // `onBlur` event from them.
        if (inputOptions.touchOnChange) {
          touch(e);
        }

        const partialNewState = { [name]: value };
        const newValues = { ...formState.current.values, ...partialNewState };

        formOptions.onChange(e, formState.current.values, newValues);

        if (!inputOptions.validateOnBlur) {
          makeValidation(value, newValues);
        }

        formState.setValues(partialNewState);
      }),
      onBlur: callbacks.getOrSet(ON_CHANGE_HANDLER + key, e => {
        touch(e);

        inputOptions.onBlur(e);
        formOptions.onBlur(e);

        /**
         * Limiting input validation on blur to:
         * A) when it's either touched for the first time
         * B) when it's marked as dirty due to a value change
         */
        /* istanbul ignore else */
        if (!formState.current.touched[name] || isDirty(name)) {
          makeValidation();
          setDirty(name, false);
        }
      }),
    };
  };

  const formProps = ({ name, onSubmit = () => {} }) => {
    const key = `${name}.form`;

    function makeValidation(name, validator) {
      const [validities, errors] = validate(
        name,
        formState.current.values[name],
        formState.current.values,
        validator
      );
      formState.setValidity(validities);
      formState.setError(errors);
    }

    return {
      onSubmit: callbacks.getOrSet(ON_SUBMIT_HANDLER + key, e => {
        e.preventDefault();

        Object.entries(formState.current.validators || {}).forEach(
          ([fieldName, validator]) => {
            makeValidation(fieldName, validator);
          }
        );
        if (
          Object.values(formState.current.validity || []).every(
            v => v && v !== false
          )
        ) {
          onSubmit(formState.current.values, e);
        }
      }),
    };
  };

  return [
    {
      ...formState.current,
    },
    {
      field: fieldProps,
      form: formProps,
    },
  ];
}
