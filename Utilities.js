import {
  accumulatedAverage,
  dateBasedRandom,
  mapGetter,
  modulo,
  random,
  roundBoundry,
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
  flattenObject,
  isBase,
  isEmptyObject,
  isObject,
  objectEquality,
  referencedClone,
} from './src/dataComparison/index.js';

import {
  debounce,
  duplicateElementIds,
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
  copyText,
  decolour,
  enumerate,
  generateEnums,
  match,
  pasteText,
  sleep,
} from './src/tools/index.js';

export {
  DATA_TYPES,
  // 0
  accumulatedAverage,
  adhocArray,
  batchBy,
  clampRange,
  compareObjectByProperty,
  // 5
  consoleGroup,
  consoleTable,
  copyText,
  dateBasedRandom,
  dataType,
  // 10
  decolour,
  debounce,
  duplicateElementIds,
  enumerate,
  exercise,
  // 15
  flattenObject,
  generateEnums,
  groupBy,
  inRange,
  isBase,
  // 20
  isEmptyObject,
  isObject,
  liniarInterpolate,
  loopRange,
  mapGetter,
  // 25
  mapRanges,
  match,
  mockIntervalFunctions,
  mockTimeoutFunctions,
  // 30
  modulo,
  normaliseRange,
  objectEquality,
  pasteText,
  permute,
  poller,
  // 35
  random,
  range,
  rangeBetween,
  rangeFrom,
  rangeGenerator,
  // 40
  reconcileArrays,
  referencedClone,
  replaceArray,
  roundBoundry,
  sanatise,
  // 45
  shuffleArray,
  sleep,
  throttle,
  transposeArray,
  unflatten,
  // 50
};
