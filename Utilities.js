var IUtility = {
  accumulatedAverage,
  clampRange,
  normaliseRange,
  liniarInterpolate,
  mapRanges,
  rangeBetween,
  rangeFrom,
  inRange,
  loopRange,

  intersectArrays,
  unionArrays,
  replaceArray,

  base64Encode,
  base64Decode,
  shortDay,
  longDay,
  shortMonth,
  longMonth,
  caseConverter,

  objectEquality,
  dataType,

  exercise,
  consoleTable: console_table,
  sleep,
  memoize,
  curry,

  CAMEL: "C",
  GLOBAL: "G",
  HEADER: "H",
  KABAB: "K",
  LOWER: "L",
  PASCAL: "P",
  TITLE: "T",
  UPPER: "U",
};

export default IUtility;

function accumulatedAverage(averageToDate = 0, sampleSize = 0) {
  var runningTotal = averageToDate * (sampleSize || 1);
  var currentSampleSize = sampleSize;
  return (newValue, newAverage, newSampleSize) => {
    currentSampleSize = newSampleSize || currentSampleSize + 1;
    runningTotal =
      (newAverage && newSampleSize
        ? newAverage * (newSampleSize - 1)
        : runningTotal) + newValue;
    return runningTotal / currentSampleSize;
  };
}

function clampRange(min, max) {
  return (value) => Math.min(Math.max(value, min), max);
}
function normaliseRange(start, end) {
  return (value) => (value - start) / (end - start);
}
function liniarInterpolate(start, end) {
  return (factor) => start * (1 - factor) + end * factor;
}
function mapRanges(fromMin, fromMax, toMin, toMax) {
  var norlaise = normaliseRange(fromMin, fromMax);
  var interpolate = liniarInterpolate(toMin, toMax);
  return (value) => interpolate(norlaise(value));
}

function rangeBetween(min, max, step = 1) {
  return [...Array((max - min) / step).keys()].map(
    (index) => index * step + min
  );
}

function dataType(subject) {
  return Object.prototype.toString
    .call(subject)
    .match(/\s(?<T>[^\]]*)/)
    .groups.T.toLowerCase();
}

function replaceArray(targetArray, arrayContent = []) {
  targetArray.splice(0, targetArray.length, ...arrayContent);
}

function rangeFrom(init = 0, len = 1, step = 1) {
  var stepFn = (_, inc) =>
    (typeof step == "number" ? step * inc : step(inc)) + init;
  return [...Array(len)].map(stepFn);
}

function inRange(from, to) {
  if (arguments.length != 2)
    throw new SyntaxError(
      "overlappingRanges needs to be provided with two primary values."
    );
  var aFrom = Math.min(from, to);
  var aTo = Math.max(from, to);
  return function check(from, to) {
    var xTo = arguments.length == 1 ? from : to;
    var bFrom = Math.min(from, xTo);
    var bTo = Math.max(from, xTo);
    return !(bTo < aFrom || bFrom > aTo);
  };
}
function loopRange(max, min = 0) {
  return function move(cur, dir) {
    return ((cur + dir + max - min) % max) + min;
  };
}

function intersectArrays(...arrays) {
  return arrays.reduce((arrAcc, arrN) =>
    [...new Set(arrAcc)].filter((item) => arrN.includes(item))
  );
}
function unionArrays(...arrays) {
  return [...new Set(arrays.flat())];
}

function exercise(expected, actual, id = "") {
  var expectedResult = JSON.stringify(expected);
  var actualResult = JSON.stringify(actual);
  var exerId = id ? ` ${id}` : "";
  if (expectedResult == actualResult) {
    console.info(
      `%cEXERCISE${exerId} - Passed:	Expected (${expectedResult}), Received (${actualResult}).`,
      "color: green;"
    );
    return true;
  }
  console.info(
    `%cEXERCISE${exerId} - Failed:	Expected (${expectedResult}), Received (${actualResult}).`,
    "color: red;"
  );
  return false;
}

function base64Encode(bin) {
  return btoa(
    encodeURIComponent(bin).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(Number(`0x${p1}`))
    )
  );
}
function base64Decode(b64) {
  return decodeURIComponent(
    [...b64.replace(/=*$/, "")]
      .map((char) =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
          .indexOf(char)
          .toString(2)
          //@ts-ignore missing padStart method of String objects.
          .padStart(6, "0")
      )
      .join("")
      .match(/.{8}/g)
      .map((bin) => `%${parseInt(bin, 2).toString(16).toUpperCase()}`)
      .join("")
  );
}

function shortDay(lang = "en-GB", idx) {
  var dateString = (_) =>
    new Date(1970, 0, 4 + _).toLocaleString(lang, {
      weekday: "short",
    });
  return arguments.length == 2 ? dateString(idx) : dateString;
}
function longDay(lang = "en-GB", idx) {
  var dateString = (_) =>
    new Date(1970, 0, 4 + _).toLocaleString(lang, { weekday: "long" });
  return arguments.length == 2 ? dateString(idx) : dateString;
}
function shortMonth(lang = "en-GB", idx) {
  var dateString = (_) =>
    new Date(1970, _, 1).toLocaleString(lang, { month: "short" });
  return arguments.length == 2 ? dateString(idx) : dateString;
}
function longMonth(lang = "en-GB", idx) {
  var dateString = (_) =>
    new Date(1970, _, 1).toLocaleString(lang, { month: "long" });
  return arguments.length == 2 ? dateString(idx) : dateString;
}

function objectEquality(obj1, obj2) {
  return deepEquality(obj1, obj2);

  function deepEquality(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !deepEquality(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }

  function isObject(object) {
    return object != null && typeof object === "object";
  }
}

function caseConverter(textCase) {
  var textConversion = textCase && textCase.toUpperCase();
  var conversionCheck = (_) => (text) => _.includes(text);
  var isValidConversion = conversionCheck("CGHKLPTU");
  var isSplitAtUnderscore = conversionCheck("CGHKPT");
  var isSplitAtHyphen = conversionCheck("CGKP");
  var isJoinWithSpace = conversionCheck("HLTU");
  var isJoinWithHyphen = conversionCheck("K");
  var isJoinWithUnderscore = conversionCheck("G");
  var isUppercaseConversion = conversionCheck("GU");
  var isLowercaseConversion = conversionCheck("KL");
  var isFirstCamel = (conversionCase, index) =>
    conversionCase == IUtility.CAMEL && !index;
  var isTitleAcronym = (conversionCase, text) =>
    conversionCase == IUtility.TITLE && !/[a-z]/.test(text);

  if (!isValidConversion(textConversion)) {
    throw Error(
      "caseConverter: Invalid case specified. Must be one of the expected constants."
    );
  }

  return function convertString(subjectText) {
    var trimedText = subjectText.trim();
    var dedupedText = trimedText
      .replace(/_+/g, "_")
      .replace(/-+/g, "-")
      .replace(/\s+/g, " ");

    var splitDelimiters = `[${isSplitAtUnderscore(textConversion) ? "_" : ""}${
      isSplitAtHyphen(textConversion) ? "-" : ""
    }\\s]`;
    var joinDelimiter = isJoinWithSpace(textConversion)
      ? " "
      : isJoinWithUnderscore(textConversion)
      ? "_"
      : isJoinWithHyphen(textConversion)
      ? "-"
      : "";

    var splitPattern = new RegExp(splitDelimiters, "g");
    var splitText = dedupedText.split(splitPattern);
    var convertedText = splitText.map((text, index) => {
      if (isUppercaseConversion(textConversion)) return text.toUpperCase();
      if (isLowercaseConversion(textConversion)) return text.toLowerCase();
      if (isFirstCamel(textConversion, index)) return text.toLowerCase();
      if (isTitleAcronym(textConversion, text)) return text.toUpperCase();
      return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
    });
    var joinedText = convertedText.join(joinDelimiter);
    return joinedText;
  };
}

function console_table(arr, domNode = document.body) {
  function getHeading(row) {
    return Array.isArray(row)
      ? row.map((_, idx) => `<th>${idx + 1}</th>`).join("")
      : typeof row === "object"
      ? Object.keys(row)
          .map((col) => `<th>${col}</th>`)
          .join("")
      : `<th>Value</th>`;
  }
  function getData(row) {
    const htmlData = (cell) => `<td>${cell}</td>`;
    return Array.isArray(row)
      ? row.map(htmlData).join("")
      : typeof row === "object"
      ? Object.values(row).map(htmlData).join("")
      : htmlData(row);
  }

  domNode.innerHTML += arr.length
    ? `<table border="1">
<tr><th>#</th>${getHeading(arr[0])}</tr>
${arr
  .map(
    (row, idx) => `<tr><td>${idx}</td>${getData(row)}</tr>
`
  )
  .join("")}</table>`
    : "";
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function memoize(fn, _cache = {}) {
  return (...args) =>
    ((key) => (_cache[key] = _cache[key] || fn(...args)))(JSON.stringify(args));
}

function curry(fn, _args = []) {
  return (...args) =>
    ((a) => (a.length === fn.length ? fn(...a) : curry(fn, a)))([
      ..._args,
      ...args,
    ]);
}
