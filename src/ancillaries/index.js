import { DATA_TYPES, dataType } from '../dataComparison/index.js';

export function accumulatedAverage(averageToDate = 0, sampleSize = 0) {
  let runningTotal = averageToDate * (sampleSize || 1);
  let currentSampleSize = sampleSize;
  return (newValue, newAverage, newSampleSize) => {
    currentSampleSize = newSampleSize || currentSampleSize + 1;
    runningTotal =
      (newAverage && newSampleSize
        ? newAverage * (newSampleSize - 1)
        : runningTotal) + newValue;
    return runningTotal / currentSampleSize;
  };
}

export function mapGetter(mapInstance, entityFactory) {
  return (entityId, entityParams) =>
    mapInstance.get(entityId) ||
    mapInstance
      .set(entityId, entityFactory(entityId, entityParams))
      .get(entityId);
}

export function dateBasedRandom() {
  const baseValue = Date.now();
  const multiplier = Date.now() % 1000;
  return +[...`${baseValue * multiplier}.0`].reverse().join('');
}

export function random(max, min = 0, precision = 0) {
  const multiplier = 10 ** precision;
  return () =>
    min + Math.floor(dateBasedRandom() * (max - min) * multiplier) / multiplier;
}

export function roundBoundry(interval, rounderFn = 'round') {
  return (value) => Math[rounderFn](value / interval) * interval;
}

export function modulo(mod, val) {
  return val == null ? (_val) => _mod(mod, _val) : _mod(mod, val);
  function _mod(mod, val) {
    return (val + mod) % mod;
  }
}

export function webStore(keyName, localWebStorage = true) {
  const webStorage = localWebStorage
    ? window.localStorage
    : window.sessionStorage;
  const clear = () => webStorage.clear();
  const get = (defaultValue = null) => {
    const value = webStorage.getItem(keyName);
    return value ? JSON.parse(value) : defaultValue;
  };
  const remove = () => webStorage.removeItem(keyName);
  const set = (value) => webStorage.setItem(keyName, JSON.stringify(value));

  return {
    clear,
    get,
    remove,
    set,
  };
}

webStore.sessionWebStorage = false;

export function postJson(data, headers = {}) {
  try {
    const body = JSON.stringify(data);
    return {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  } catch (error) {
    throw Error(`JSON Stringify failed: ${error.message}`);
  }
}
