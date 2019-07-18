Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly)
    keys = keys.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _toPrimitive(input, hint) {
  if (typeof input !== 'object' || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || 'default');
    if (typeof res !== 'object') return res;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }

  return (hint === 'string' ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, 'string');

  return typeof key === 'symbol' ? key : String(key);
}

/**
 * Returns a function that can be called with an object. The return value of the
 * new function is a copy of the object excluding the key passed initially.
 */
function omit(key) {
  return function(object) {
    var toRemove = object[key],
      rest = _objectWithoutProperties(object, [key].map(_toPropertyKey));

    return rest;
  };
}
/**
 * An empty function. It does nothing.
 */

function noop() {}
/**
 * Like `noop`, but passes through the first argument.
 */

function identity(val) {
  return val;
}
/**
 * Cast non-string values to a string, with the exception of functions, symbols,
 * and undefined.
 */

function toString(value) {
  switch (_typeof(value)) {
    case 'function':
    case 'symbol':
    case 'undefined':
      return '';

    default:
      return '' + value;
    // eslint-disable-line prefer-template
  }
}
function isFunction(value) {
  return typeof value === 'function';
}

var objectToString = function objectToString(value) {
  return Object.prototype.toString.call(value);
};
/**
 * Determines if a value is an empty collection (object, array, string, map, set)
 * @note this returns false for anything else.
 */

function isEmpty(value) {
  if (value == null) {
    return true;
  }

  if (Array.isArray(value) || typeof value === 'string') {
    return !value.length;
  }

  if (
    objectToString(value) === '[object Map]' ||
    objectToString(value) === '[object Set]'
  ) {
    return !value.size;
  }

  if (objectToString(value) === '[object Object]') {
    return !Object.keys(value).length;
  }

  return false;
}

var defaultInputOptions = {
  onChange: identity,
  onBlur: noop,
  validate: null,
  validateOnBlur: false,
  touchOnChange: false,
};
function parseInputArgs(args) {
  var name;
  var ownValue;
  var options;

  if (typeof args[0] === 'string' || typeof args[0] === 'number') {
    var _args = _slicedToArray(args, 2);

    name = _args[0];
    ownValue = _args[1];
  } else {
    var _args2 = _slicedToArray(args, 1);

    var _args2$ = _args2[0];
    name = _args2$.name;
    ownValue = _args2$.value;
    options = _objectWithoutProperties(_args2$, ['name', 'value']);
  }

  return _objectSpread2(
    {
      name: name,
      ownValue: ownValue,
    },
    defaultInputOptions,
    {},
    options
  );
}

function useCache() {
  var cache = react.useRef(new Map());

  var has = function has(key) {
    return cache.current.has(key);
  };

  var get = function get(key) {
    return cache.current.get(key);
  };

  var set = function set(key, value) {
    return cache.current.set(key, value);
  };

  var getOrSet = function getOrSet(key, value) {
    return has(key) ? get(key) : set(key, value) && get(key);
  };

  return {
    getOrSet: getOrSet,
    set: set,
    has: has,
    get: get,
  };
}

function stateReducer(state, newState) {
  return isFunction(newState)
    ? newState(state)
    : _objectSpread2({}, state, {}, newState);
}

function useState(_ref) {
  var initialState = _ref.initialState,
    onClear = _ref.onClear;
  var state = react.useRef();

  var _useReducer = react.useReducer(stateReducer, initialState || {}),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    values = _useReducer2[0],
    setValues = _useReducer2[1];

  var _useReducer3 = react.useReducer(stateReducer, {}),
    _useReducer4 = _slicedToArray(_useReducer3, 2),
    touched = _useReducer4[0],
    setTouched = _useReducer4[1];

  var _useReducer5 = react.useReducer(stateReducer, {}),
    _useReducer6 = _slicedToArray(_useReducer5, 2),
    validity = _useReducer6[0],
    setValidity = _useReducer6[1];

  var _useReducer7 = react.useReducer(stateReducer, {}),
    _useReducer8 = _slicedToArray(_useReducer7, 2),
    errors = _useReducer8[0],
    setError = _useReducer8[1];

  state.current = {
    values: values,
    touched: touched,
    validity: validity,
    errors: errors,
  };

  function _setField(name, value, inputValidity, inputTouched, inputError) {
    setValues(_defineProperty({}, name, value));
    setTouched(_defineProperty({}, name, inputTouched));
    setValidity(_defineProperty({}, name, inputValidity));
    setError(_defineProperty({}, name, inputError));
  }

  var clearField = function clearField(name) {
    return _setField(name);
  };

  function setAll(fields, value) {
    return fields.reduce(function(obj, name) {
      return Object.assign(obj, _defineProperty({}, name, value));
    }, {});
  }

  return {
    /**
     * @type {{ values, touched, validity, errors }}
     */
    get current() {
      return state.current;
    },

    setValues: setValues,
    setTouched: setTouched,
    setValidity: setValidity,
    setError: setError,
    controls: {
      clearField: clearField,
      clear: function clear() {
        Object.keys(state.current.values).forEach(clearField);
        onClear();
      },
      setField: function setField(name, value) {
        _setField(name, value, true, true);
      },
      setFields: function setFields(fieldValues) {
        var options =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};

        if (fieldValues) {
          setValues(fieldValues);
        }

        if (options.touched) {
          setTouched(options.touched);
        }

        if (options.validity) {
          setValidity(options.validity);

          if (options.errors === undefined) {
            // Clear the errors for valid fields:
            var errorFields = Object.entries(options.validity).reduce(function(
              errorsObj,
              _ref2
            ) {
              var _ref3 = _slicedToArray(_ref2, 2),
                name = _ref3[0],
                isValid = _ref3[1];

              if (isValid) {
                return Object.assign(
                  {},
                  errorsObj || {},
                  _defineProperty({}, name, undefined)
                );
              }

              return errorsObj;
            },
            null);

            if (errorFields) {
              setError(errorFields);
            }
          }
        }

        if (options.errors) {
          setError(options.errors);

          if (options.validity === undefined) {
            // Fields with errors are not valid:
            setValidity(setAll(Object.keys(options.errors), false));
          }
        }
      },
      setFieldError: function setFieldError(name, error) {
        setValidity(_defineProperty({}, name, false));
        setError(_defineProperty({}, name, error));
      },
    },
  };
}

var ON_CHANGE_HANDLER = 0;
var ON_BLUR_HANDLER = 1;

var defaultFormOptions = {
  onChange: noop,
  onBlur: noop,
  onTouched: noop,
  onClear: noop,
};
function useFormState(initialState, options) {
  var formOptions = _objectSpread2({}, defaultFormOptions, {}, options);

  var formState = useState(
    _objectSpread2(
      {
        initialState: initialState,
      },
      formOptions
    )
  );

  var _useCache = useCache(),
    setDirty = _useCache.set,
    isDirty = _useCache.has;

  var callbacks = useCache();

  var createPropsGetter = function createPropsGetter() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    var _parseInputArgs = parseInputArgs(args),
      name = _parseInputArgs.name,
      ownValue = _parseInputArgs.ownValue,
      inputOptions = _objectWithoutProperties(_parseInputArgs, [
        'name',
        'ownValue',
      ]);

    var hasValueInState = formState.current.values[name] !== undefined; // This is used to cache input props that shouldn't change across
    // re-renders.  Note that for `raw` values, `toString(ownValue)`
    // will return '[object Object]'.  This means we can't have multiple
    // raw inputs with the same name and different values, but this is
    // probably fine.

    var key = ''.concat(name, '.').concat(toString(ownValue));

    function setInitialValue() {
      formState.setValues(_defineProperty({}, name, ''));
    }

    function validate(e) {
      var value =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : formState.current.values[name];
      var values =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : formState.current.values;
      var error;
      var isValid = true;
      /* istanbul ignore else */

      if (isFunction(inputOptions.validate)) {
        var result = inputOptions.validate(
          value,
          values,
          _objectSpread2({}, formState.current, {}, formState.controls),
          e
        );

        if (result !== true && result != null) {
          isValid = false;
          error = result !== false ? result : '';
        }
      }

      formState.setValidity(_defineProperty({}, name, isValid));
      formState.setError(
        isEmpty(error) ? omit(name) : _defineProperty({}, name, error)
      );
    }

    function touch(e) {
      if (!formState.current.touched[name]) {
        formState.setTouched(_defineProperty({}, name, true));
        formOptions.onTouched(e);
      }
    }

    var inputProps = {
      get value() {
        // auto populating initial state values on first render
        if (!hasValueInState) {
          setInitialValue();
        } // auto populating default values of touched

        if (formState.current.touched[name] == null) {
          formState.setTouched(_defineProperty({}, name, false));
        }

        return hasValueInState ? formState.current.values[name] : '';
      },

      onChange: callbacks.getOrSet(ON_BLUR_HANDLER + key, function(e) {
        setDirty(name, true);
        var value = inputOptions.onChange(e);

        if (value === undefined) {
          // setting value to its current state if onChange does not return
          // value to prevent React from complaining about the input switching
          // from controlled to uncontrolled
          value = formState.current.values[name];
        } // Mark raw fields as touched on change, since we might not get an
        // `onBlur` event from them.

        if (inputOptions.touchOnChange) {
          touch(e);
        }

        var partialNewState = _defineProperty({}, name, value);

        var newValues = _objectSpread2(
          {},
          formState.current.values,
          {},
          partialNewState
        );

        formOptions.onChange(e, formState.current.values, newValues);

        if (!inputOptions.validateOnBlur) {
          validate(e, value, newValues);
        }

        formState.setValues(partialNewState);
      }),
      onBlur: callbacks.getOrSet(ON_CHANGE_HANDLER + key, function(e) {
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
          validate(e);
          setDirty(name, false);
        }
      }),
    };
    return {
      onChange: inputProps.onChange,
      onBlur: inputProps.onBlur,
      value: inputProps.value,
    };
  };

  return [
    _objectSpread2({}, formState.current, {}, formState.controls),
    createPropsGetter,
  ];
}

exports.useFormState = useFormState;
