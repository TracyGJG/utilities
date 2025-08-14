const _document = document;
const DEFAULT_DELAY = 1000;

export function sanatise(text, dom = _document) {
  const div = dom.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function debounce(callback, delay = DEFAULT_DELAY) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function throttle(callback, delay = DEFAULT_DELAY) {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        callback(...args);
        timeout = null;
      }, delay);
    }
  };
}

export function poller(interval, cycles, checkFn, actionFn) {
  let cycle = 0;

  const Interval = setInterval(() => {
    if (checkFn() || cycle === cycles) {
      actionFn();
      clearInterval(Interval);
    }
    cycle++;
  }, interval);

  return Interval;
}

export function mockTimeoutFunctions() {
  const timers = new Map();

  return {
    clearTimeout,
    setTimeout,
    clockTick,
  };

  function clockTick(timerRef, tick) {
    if (!timers.has(timerRef)) return;

    timers.get(timerRef).duration -= tick;
    if (timers.get(timerRef).duration > 0) return null;

    const result = timers.get(timerRef).callback();
    timers.delete(timerRef);
    return result;
  }

  function clearTimeout(timerRef) {
    return timers.delete(timerRef);
  }

  function setTimeout(callback, duration) {
    const timer = Date.now();
    timers.set(timer, { callback, duration });
    return timer;
  }
}

export function mockIntervalFunctions() {
  const timers = new Map();

  return {
    clearInterval,
    setInterval,
    clockTick,
  };

  function clockTick(timerRef, tick) {
    if (!timers.has(timerRef)) return;

    timers.get(timerRef).duration -= tick;
    if (timers.get(timerRef).duration > 0) return null;

    timers.get(timerRef).duration = timers.get(timerRef).interval;
    return timers.get(timerRef).callback();
  }

  function clearInterval(timerRef) {
    return timers.delete(timerRef);
  }

  function setInterval(callback, duration) {
    const timer = Date.now();
    timers.set(timer, { callback, duration, interval: duration });
    return timer;
  }
}

export function duplicateElementIds(
  { target, isPrefixed } = { target: document.body, isPrefixed: false }
) {
  const elementsWithIds = [...target.querySelectorAll(`[id]`)].map(
    (el) => el.id
  );
  const uniqueIds = [...new Set(elementsWithIds)];
  const duplicateIds = uniqueIds.filter(
    (id) => elementsWithIds.filter((elId) => elId === id).length > 1
  );

  if (duplicateIds.length) {
    return duplicateIds;
  }
  if (isPrefixed) {
    return elementsWithIds.filter((id) => id.at(0) !== '$');
  }
  return [];
}
