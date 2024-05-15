# Change Log

## 15th May 2024

- New simple `range` function added to the ranges module.

## 19th April 2024

- New `lensFn` function added to the tools module.

## 23rd November 2023

- New function added to the data-comparison module: `referencedClone`.

## 11th November 2023

- New function added to ancillaries module: `dateBasedRandom`.

## 24th October 2023

- New functions added to the tools module: `escapeRegExp`, `isRegExpPattern` and `regExpString`.

## 6th October 2023

- Replaced the `regExpFromString` function of the tools module for an improved `regExpTemplate` function.
- Added the `flattenObject` function to the dataComparison module.

## 11th August 2023

- Added the `permute` and `unflatten` functions to the Array section.

## 10th June 2023

- Added the `debounce` and `throttle` functions to the DOM section.

## 7th May 2023

- Added the `regExpFromString`, `parseJson`, `stringifyJson` and `generateEnums` functions to the tools section.

## 5th May 2023

- Added DOM functions inspired from the work of [Dave Gray](https://youtu.be/LDgPTw6tePk).
  - Arrays
    - shuffleArray - Shuffle an array of numbers
  - DOM
    - acc - add CSS class
    - dce - delete child elements
    - sui - sanitive untrusted/user input
  - Data Comparison
    - isBase - confirms if the given datum has a value of null or undefined.
    - isObject - confirms if the given datum is an Object.
- Tools
  - SIMD - refined.

## 29th April 2023

- Range methods `rangeGenerator` added.

## 2nd April 2023

- Array methods `batchBy.size` and `batchBy.number` added.

## 1st April 2023

- `simd` added to tools.
- `extractProperty` removed from dataComparison (duplicate of tools/`lens`).

## 17th March 2023

- DOM manipulation functions added.
- Clipboard functions `copy` and `paste` added.
- Exercise function `consoleGroup` added.

* DOM manipulation functions inspired but Kyle Cook's YouTube video [Stop Wasting Your Time - Use These 16 JS Utility Functions Instead
  ](https://youtu.be/EoUIS2PxKCs) on his [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified) channel.

## 7th March 2023

- Added `isEmptyObject` function to Data Comparison group.
- Added Ancillary functions `random` and `webStore`.

## 1st March 2023

- Added the `mapGetter` function to the Ancillaries group.

## 4th January 2023

- Added the `adhocArray` function to the Exercising group.

---

- [Archived Change Log](archivedLog.md)

- [Index](README.md)
