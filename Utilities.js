import {
  accumulatedAverage,
  dateBasedRandom,
  mapGetter,
  modulo,
  postJson,
  random,
  roundBoundry,
  webStore,
} from './src/ancillaries/index.js';

import {
  batchBy,
  groupBy,
  permute,
  reconcileArrays,
  replaceArray,
  shuffleArray,
  transposeArray,
  unflatten,
} from './src/arrays/index.js';

import {
  DATA_TYPES,
  compareObjectByProperty,
  dataType,
  duplicateObject,
  flattenObject,
  isBase,
  isEmptyObject,
  isObject,
  objectEquality,
  referencedClone,
} from './src/dataComparison/index.js';

import { base64Decode, base64Encode } from './src/dataConverters/index.js';

import {
  duplicateElementIds,
  debounce,
  mockIntervalFunctions,
  mockTimeoutFunctions,
  poller,
  sanatise,
  throttle,
} from './src/dom/index.js';

import {
  adhocArray,
  consoleGroup,
  consoleTable,
  exercise,
} from './src/exercising/index.js';

import {
  clampRange,
  inRange,
  liniarInterpolate,
  loopRange,
  mapRanges,
  normaliseRange,
  range,
  rangeBetween,
  rangeFrom,
  rangeGenerator,
} from './src/ranges/index.js';

import {
  compose,
  copyText,
  curry,
  decolour,
  enumerate,
  escapeRegExp,
  generateEnums,
  isRegExpPattern,
  lens,
  lensFn,
  match,
  memoise,
  parseJson,
  pasteText,
  regExpString,
  regExpTemplate,
  simd,
  sleep,
  stringifyJson,
} from './src/tools/index.js';

export {
  DATA_TYPES,
  // 0
  accumulatedAverage,
  adhocArray,
  base64Decode,
  base64Encode,
  batchBy,
  // 5
  checkElementsForDuplicateIds,
  clampRange,
  compareObjectByProperty,
  compose,
  consoleGroup,
  // 10
  consoleTable,
  copyText,
  curry,
  dateBasedRandom,
  dataType,
  // 15
  decolour,
  debounce,
  duplicateObject,
  enumerate,
  escapeRegExp,
  // 20
  exercise,
  flattenObject,
  generateEnums,
  groupBy,
  inRange,
  // 25
  isBase,
  isEmptyObject,
  isObject,
  isRegExpPattern,
  lens,
  // 30
  lensFn,
  liniarInterpolate,
  loopRange,
  mapGetter,
  mapRanges,
  // 35
  match,
  memoise,
  mockIntervalFunctions,
  mockTimeoutFunctions,
  modulo,
  // 40
  normaliseRange,
  objectEquality,
  parseJson,
  pasteText,
  permute,
  // 45
  poller,
  postJson,
  random,
  range,
  rangeBetween,
  // 50
  rangeFrom,
  rangeGenerator,
  reconcileArrays,
  referencedClone,
  regExpString,
  // 55
  regExpTemplate,
  replaceArray,
  roundBoundry,
  sanatise,
  shuffleArray,
  // 60
  simd,
  sleep,
  stringifyJson,
  throttle,
  transposeArray,
  // 65
  unflatten,
  webStore,
};
