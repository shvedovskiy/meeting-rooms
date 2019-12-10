import { useReducer, useRef } from 'react';

function stateReducer(state, newState) {
  return typeof newState === 'function' ? newState(state) : { ...state, ...newState };
}

export function useFormState(initialState) {
  const state = useRef();
  const [values, setValues] = useReducer(stateReducer, initialState ?? {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});
  const [errors, setError] = useReducer(stateReducer, {});
  const [validators, setValidator] = useReducer(stateReducer, {});
  const [blurValidators, setBlurValidator] = useReducer(stateReducer, {});

  state.current = {
    values,
    touched,
    validity,
    errors,
    validators,
    blurValidators,
  };

  return {
    get current() {
      return state.current;
    },
    setValues,
    setTouched,
    setValidity,
    setError,
    setValidator,
    setBlurValidator,
  };
}
