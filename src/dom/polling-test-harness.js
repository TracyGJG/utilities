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

  poller(
    500,
    10,
    () => {
      console.log(`\tCounter: ${++counter}`);
      return counter === maxCounter;
    },
    () => {
      console.log('\tCounter expired');
    }
  );
}

setTimeout(() => {
  console.log(`\nPoller - cancelled`);
  let counter = 0;
  const maxCounter = 10;

  const Poller = poller(
    500,
    10,
    () => {
      console.log(`\tCounter: ${++counter}`);
      return counter === maxCounter;
    },
    () => {
      console.log('\tCounter expired');
    }
  );
  setTimeout(() => {
    clearTimeout(Poller);
    console.log('\tCounter cancelled');
  }, 2000);
}, 5000);
