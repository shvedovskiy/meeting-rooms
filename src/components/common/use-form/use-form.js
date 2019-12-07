import { useCache } from './use-cache';
import { useFormState } from './use-form-state';

const ON_CHANGE_HANDLER = 0;
const ON_BLUR_HANDLER = 1;
const ON_SUBMIT_HANDLER = 2;

const defaultFormOptions = {
  onChange: value => value,
  onBlur: () => {},
  onTouched: () => {},
  submitValidator: () => {},
};

const defaultFieldOptions = {
  onChange: value => value,
  onBlur: () => {},
  validate: null,
  validateOnBlur: null,
  touchOnChange: false,
};

function validateField(fieldName, fieldValue, formValues, validator) {
  if (typeof validator === 'function') {
    const result = validator(fieldValue, formValues);
    if (typeof result === 'boolean') {
      return [{ [fieldName]: result }, { [fieldName]: null }];
    }
    if (typeof result === 'string') {
      return [{ [fieldName]: false }, { [fieldName]: result }];
    }
    const validities = {};
    const errors = {};
    Object.entries(result).forEach(([name, fieldResult]) => {
      if (typeof fieldResult === 'boolean') {
        validities[name] = fieldResult;
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

function validateForm(formValues, validator) {
  const result = validator(formValues);
  const validities = {};
  const errors = {};
  if (typeof result !== 'boolean') {
    Object.entries(result).forEach(([name, fieldResult]) => {
      if (typeof fieldResult === 'boolean') {
        validities[name] = fieldResult;
        errors[name] = null;
      } else if (typeof fieldResult === 'string') {
        validities[name] = false;
        errors[name] = fieldResult;
      }
    });
  }
  return [validities, errors];
}

export function useForm(initialFormState, options) {
  const formOptions = { ...defaultFormOptions, ...options };

  const formState = useFormState(initialFormState);
  const { set: setDirty, has: isDirty } = useCache();
  const callbacks = useCache();

  const fieldProps = ({ name, ...options }) => {
    const fieldOptions = {
      ...defaultFieldOptions,
      ...options,
    };

    const hasValueInState = formState.current.values.hasOwnProperty(name);
    const hasValidatorInState =
      !formState.current.validators ||
      formState.current.validators[name] != null;

    const key = `${name}`;

    function setInitialValue() {
      formState.setValues({ [name]: '' });
    }

    function makeFieldValidation(value, formValues, validator) {
      const [validities, errors] = validateField(
        name,
        value,
        formValues,
        validator
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

        if (!hasValidatorInState) {
          if (typeof fieldOptions.validate === 'function') {
            formState.setValidator({ [name]: fieldOptions.validate });
          }
          if (typeof fieldOptions.validateOnBlur === 'function') {
            formState.setBlurValidator({ [name]: fieldOptions.validateOnBlur });
          }
        }

        // auto populating default values of touched
        if (formState.current.touched[name] == null) {
          formState.setTouched({ [name]: false });
        }
        return hasValueInState ? formState.current.values[name] : '';
      },
      onChange: callbacks.getOrSet(ON_CHANGE_HANDLER + key, e => {
        const formValues = formState.current.values;
        setDirty(name, true);
        const value = fieldOptions.onChange(e);
        // if (value === undefined) {
        //   // setting value to its current state if onChange does not return
        //   // value to prevent React from complaining about the input switching
        //   // from controlled to uncontrolled
        //   value = formValues[name];
        // }

        // Mark raw fields as touched on change, since we might not get an
        // `onBlur` event from them.
        if (fieldOptions.touchOnChange) {
          touch(e);
        }

        let partialNewState = { [name]: value };
        const newFormValues = {
          ...formValues,
          ...partialNewState,
        };

        partialNewState = formOptions.onChange(partialNewState, formValues);
        makeFieldValidation(value, newFormValues, fieldOptions.validate);
        formState.setValues(partialNewState);
      }),
      onBlur: callbacks.getOrSet(ON_BLUR_HANDLER + key, e => {
        touch(e);
        fieldOptions.onBlur(e);
        formOptions.onBlur(e);

        /**
         * Limiting input validation on blur to:
         * A) when it's either touched for the first time
         * B) when it's marked as dirty due to a value change
         */
        if (fieldOptions.validateOnBlur) {
          if (!formState.current.touched[name] || isDirty(name)) {
            makeFieldValidation(
              formState.current.values[name],
              formState.current.values,
              fieldOptions.validateOnBlur
            );
            setDirty(name, false);
          }
        }
      }),
    };
  };

  const formProps = ({ name, onSubmit: submitCallback = () => {} }) => {
    const key = `${name}.form`;

    function makeSubmitValidation() {
      const [validities, errors] = validateForm(
        formState.current.values,
        formOptions.submitValidator
      );
      if (Object.keys(errors).length) {
        formState.setValidity(validities);
        formState.setError(errors);
        return false;
      }
      return true;
    }

    function makeValidation(validators = {}) {
      const allValidities = {};
      const allErors = {};
      Object.entries(validators).forEach(([fieldName, fieldValidator]) => {
        const [validity, error] = validateField(
          fieldName,
          formState.current.values[fieldName],
          formState.current.values,
          fieldValidator
        );
        Object.assign(allValidities, validity);
        const errorMessages = Object.keys(error).reduce((res, key) => {
          if (error[key] != null) {
            res[key] = error[key];
          }
          return res;
        }, {});
        if (Object.keys(errorMessages).length) {
          Object.assign(allErors, errorMessages);
        }
      });
      if (Object.keys(allErors).length) {
        formState.setValidity(allValidities);
        formState.setError(allErors);
        return false;
      }
      return true;
    }

    return {
      onSubmit: callbacks.getOrSet(ON_SUBMIT_HANDLER + key, e => {
        e.preventDefault();
        if (
          makeSubmitValidation() &&
          makeValidation(formState.current.blurValidators) &&
          makeValidation(formState.current.validators)
        ) {
          submitCallback(formState.current.values);
        }
      }),
    };
  };

  return [
    { ...formState.current },
    {
      field: fieldProps,
      form: formProps,
    },
  ];
}
