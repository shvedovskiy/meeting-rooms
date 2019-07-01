// @ts-ignore
Number.isInteger =
  Number.isInteger ||
  function(value) {
    return typeof value === 'number' && Number.isFinite(value) && !(value % 1);
  };
