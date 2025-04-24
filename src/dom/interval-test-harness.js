'use strict';

console.log(`\nmockIntervalFunctions`);

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
    console.log(
      `\t\tclockTick(${timerRef}, ${tick}): ${timers.get(timerRef).duration}`
    );

    if (timers.get(timerRef).duration > 0) return;
    timers.get(timerRef).duration = timers.get(timerRef).interval;
    return timers.get(timerRef).callback();
  }

  function clearInterval(timerRef) {
    const hadTimer = timers.delete(timerRef);
    console.log(`\tclearInterval: ${timerRef} - ${hadTimer}`);
  }

  function setInterval(callback, duration) {
    const timer = Date.now();
    console.log(`\tsetInterval: ${timer}`);

    timers.set(timer, { callback, duration, interval: duration });
    return timer;
  }
}

{
  const Timer = mockIntervalFunctions();

  let timeout = Timer.setInterval(() => {
    console.log(`\tMock Interval completed`);
  }, 500);

  console.log(`\tMock Interval: ${timeout}`);
  Timer.clockTick(timeout, 200);
  Timer.clockTick(timeout, 200);
  Timer.clockTick(timeout, 200);
  Timer.clockTick(timeout, 200);
  Timer.clockTick(timeout, 200);
  Timer.clockTick(timeout, 200);

  Timer.clearInterval(timeout);

  Timer.clockTick(timeout, 200);
  Timer.clearInterval(timeout);
}
