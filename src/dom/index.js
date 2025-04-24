const _document = document;
const _body = document.body;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const DEFAULT_DELAY = 1000;

export function acc(selector, className, dom = _document) {
  dom.querySelector(selector).classList.add(className);
}

export function ace(childElement, parent = _body) {
  parent.appendChild(childElement);
}

export function ael(
  eventType,
  callback,
  selector,
  options,
  parent = _document
) {
  parent.addEventListener(
    eventType,
    selector
      ? (evt) => evt.target.matches(selector) && callback(evt)
      : callback,
    options
  );
}

export const cde = (type, options = {}, parent = _document) =>
  _ce(type, options, parent);

export const cse = (type, options = {}, parent = _document) =>
  _ce(type, options, parent, SVG_NAMESPACE);

function _ce(type, options, parent, namespace) {
  const element = namespace
    ? parent.createElementNS(namespace, type)
    : parent.createElement(type);
  const keyTypes = {
    class: (value) => element.classList.add(value),
    dataset: (value) =>
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      }),
    text: (value) => (element.textContent = value),
  };

  Object.entries(options).forEach(([key, value]) => {
    const fn = keyTypes?.[key];
    fn ? fn(value) : element.setAttribute(key, value);
  });

  return element;
}

export function dce(parentElement) {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
}

export function qs(selector, parent = _document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = _document) {
  return [...parent.querySelectorAll(selector)];
}

export function sui(text, dom = _document) {
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

    if (timers.get(timerRef).duration > 0) return;
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

    if (timers.get(timerRef).duration > 0) return;
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
