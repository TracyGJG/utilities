function mockIntervalFunctions() {
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
    timers.delete(timerRef);
  }

  function setInterval(callback, duration) {
    const timer = Date.now();
    timers.set(timer, { callback, duration, interval: duration });
    return timer;
  }
}

const MockIntervalFunctions = mockIntervalFunctions();
const ClearInterval = globalThis.clearInterval;
const SetInterval = globalThis.setInterval;

globalThis.clearInterval = MockIntervalFunctions.clearInterval;
globalThis.setInterval = MockIntervalFunctions.setInterval;

function poller(interval, cycles, checkFn, actionFn) {
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

{
  console.log(`\nPoller - completed`);
  let counter = 0;
  const maxCounter = 10;
  let INTERVAL;

  const Poller = poller(
    500,
    10,
    () => {
      console.log(`\tCounter: ${++counter}`);
      return counter === maxCounter;
    },
    () => {
      console.log('\tCounter expired');
      ClearInterval(INTERVAL);
    }
  );

  INTERVAL = SetInterval(
    () => MockIntervalFunctions.clockTick(Poller, 100),
    100
  );
}

setTimeout(() => {
  console.log(`\nPoller - cancelled`);
  let counter = 0;
  const maxCounter = 10;
  let INTERVAL;

  const Poller = poller(
    500,
    10,
    () => {
      console.log(`\tCounter: ${++counter}`);
      return counter === maxCounter;
    },
    () => {
      console.log('\tCounter expired');
      ClearInterval(INTERVAL);
    }
  );

  INTERVAL = SetInterval(
    () => MockIntervalFunctions.clockTick(Poller, 100),
    100
  );

  setTimeout(() => {
    clearTimeout(Poller);
    console.log('\tCounter cancelled');
    MockIntervalFunctions.clearInterval(Poller);
  }, 2000);
}, 5000);
