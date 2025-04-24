'use strict';

console.log(`\nmockTimerFunctions`);

function mockTimerFunctions() {
  const timers = new Map();

  return {
    clearTimeout,
    setTimeout,
    clockTick,
  };

  function clockTick(timerRef, tick) {
    if (!timers.has(timerRef)) return;
    timers.get(timerRef).duration -= tick;
    console.log(
      `\t\tclockTick(${timerRef}, ${tick}): ${timers.get(timerRef).duration}`
    );

    if (timers.get(timerRef).duration > 0) return;
    const result = timers.get(timerRef).callback();

    timers.delete(timerRef);
    return result;
  }

  function clearTimeout(timerRef) {
    const hasTimer = timers.delete(timerRef);
    console.log(`\t\tclearTimeout: ${timerRef} - ${hasTimer}`);
  }

  function setTimeout(callback, duration) {
    const timer = Date.now();
    console.log(`\tsetTimeout: ${timer}`);

    timers.set(timer, { callback, duration });
    return timer;
  }
}

console.log(`\n\tsetTimeout`);
{
  const Timer = mockTimerFunctions();

  let timeout = Timer.setTimeout(() => {
    console.log(`\t\tMock Timeout completed`);
  }, 1000);

  console.log(`\t\tMock Timeout: ${timeout}`);
  Timer.clockTick(timeout, 2000);

  Timer.clearTimeout(timeout);
}

console.log(`\n\tclearTimeout`);
{
  const Timer = mockTimerFunctions();

  let timeout = Timer.setTimeout(() => {
    console.log(`\t\tMock Timeout completed`);
  }, 1000);

  console.log(`\t\tMock Timeout: ${timeout}`);
  Timer.clockTick(timeout, 100);
  Timer.clockTick(timeout, 100);
  Timer.clockTick(timeout, 100);

  Timer.clearTimeout(timeout);

  Timer.clockTick(timeout, 100);
  Timer.clearTimeout(timeout);
}
