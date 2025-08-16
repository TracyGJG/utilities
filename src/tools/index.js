import { DATA_TYPES, dataType } from '../dataComparison/index.js';

export function copyText(text) {
  navigator.clipboard.writeText(text);
}

export function decolour(asyncFn, syncFn) {
  return asyncFn().then(syncFn);
}

export function enumerate(source, options = {}) {
  if (dataType(source) !== DATA_TYPES.OBJECT && !Array.isArray(source)) {
    throw Error(
      'Error: E-IS The source argument supplied is not an Array or an Object.'
    );
  }
  const filterStringKeys = (key) => dataType(key) === DATA_TYPES.STRING;
  const keys = Array.isArray(source)
    ? source.filter(filterStringKeys)
    : Object.keys(source);

  if (!keys.length) {
    throw Error(
      'Error: E-NS The source argument supplied is not populated with string keys.'
    );
  }
  const VALID_OPTIONS = ['constantProperties', 'numericValues'];
  for (const option in options) {
    if (!VALID_OPTIONS.includes(option)) {
      throw Error(
        `Error: E-NR The option '${option}' is not a recognised option.`
      );
    }
    if (dataType(options[option]) !== DATA_TYPES.BOOLEAN) {
      throw Error(`Error: E-NB The option '${option}' is not a Boolean value.`);
    }
  }
  const { numericValues = false, constantProperties = false } = options;

  return Object.freeze(
    keys.reduce(
      (obj, key, index) => ({
        ...obj,
        [constantProperties ? toGlobal(key) : key]: numericValues ? index : key,
      }),
      {}
    )
  );

  function toGlobal(_propertyName) {
    const hasSpaces = /\s/.test(_propertyName);
    const globalPropertyName = hasSpaces
      ? _propertyName.replace(/\s/g, '_')
      : _propertyName.replace(/([a-z])([A-Z])/g, '$1_$2');
    return globalPropertyName.toUpperCase();
  }
}

export function generateEnums(enumsJson, options) {
  return Object.entries(enumsJson).reduce((enums, [enumKey, enumVals]) => {
    enums[enumKey] = enumerate(enumVals, options);
    return enums;
  }, {});
}

export function match(...patterns) {
  const PATTERNS = Object.freeze(
    patterns.reduce(
      (matches, pattern) => ({
        ...matches,
        [Object.keys(pattern)[0]]: Object.values(pattern)[0],
      }),
      {}
    )
  );
  const DEFAULT = Object.values(patterns[0])[0];
  return (pattern) => PATTERNS?.[pattern] ?? DEFAULT;
}

export async function pasteText() {
  return await navigator.clipboard.readText();
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
