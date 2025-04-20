# Ranges

- [clampRange](#clamprange)
- [inRange](#inrange)
- [liniarInterpolate](#liniarinterpolate)
- [loopRange](#looprange)
- [mapRanges](#mapranges)
- [normaliseRange](#normaliserange)
- [range](#range)
- [rangeBetween](#rangebetween)
- [rangeFrom](#rangefrom)
- [rangeGenerator](#rangegenerator)

- [Index](../README.md)

---

## [clampRange](:#clamprange)

Function that restricts a value to within a given numeric range. Initialised with the lower and upper boundaries of a range, this function returns another specialised function.

When the specialised function is called with a single number, the value may be changed to bring it within the predefined range.

If the input value is below the lower boundary the output from the function will be the lower boundary. Likewise, if the input value exceeds the upper boundary the output from the function will be the upper boundary.

If the input value is within the boundaries the output from the function will be the input value.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- min: lower boundary of the range.
- max: upper boundary of the range.

#### Subsequent calls

- value: datum to be clamped.

### Return Value

A value within the clamped range.

## [inRange](:#inrange)

This function supports two use cases:

1. Confirm two ranges overlap.
2. Confirm a value lies within a primary range.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- from: lower boundry of the primary range.
- to: upper boundry of the primary range.

#### Subsequent calls

- from: lower boundry of the secondary range.
- to: upper boundry of the secondary range (optional).

### Return Value

Boolean value indicating the ranges overlap or a value is within a given range.

## [liniarInterpolate](:#liniarinterpolate)

This function converts a normalised value (between 0 and 1), initilised with a given range, and returns a value within the range proportional to the input value.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- start: lower boundry of the range.
- end: upper boundry of the range.

#### Subsequent calls

- value: datum (between 0 and 1) to be interpolated.

### Return Value

A value between the _start_ and _end_ values, proportional to the input value.

## [loopRange](:#looprange)

Calculates a new value in a sequence based on the current (_cur_) input. The value increases or decreases based on the direction (_dir_) value (1 to increase, -1 to decrease.) The value changes within a defined range up to a maximum (_max_) and minimum (_min_), which is an optional input with a default of zero.

When the value exceeds the bounds of the range it loops round to the opposite end of the range.

```javascript
const zeroIndexed = Utilities.loopRange(9); // Range 0 .. 8

zeroIndexed(4); // 5
zeroIndexed(8); // 0

zeroIndexed(4, -1); // 3
zeroIndexed(0, -1); // 8

const oneIndexed = Utilities.loopRange(9, 1); // Range 1 .. 9

oneIndexed(4, 2); // 6
oneIndexed(9, 2); // 2

oneIndexed(4, -1); // 3
oneIndexed(1, -1); // 9
```

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- max: maximum output value of the range.
- min: minimal output value of the range (optional, defaulted to zero).

#### Subsequent calls

- cur: Current value within the range.
- dir: Direction of change (1 to increase and -1 to decrease.)

### Return Value

Calculated new value within the range.

## [mapRanges](:#mapranges)

The Map Ranges function is quite self explanatory. Initialised with a source and target range, and given an input value (within the source range), it returns a value in the target range with the same normalised proportion.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- fromMin: lower boundry of the source range.
- fromMax: upper boundry of the source range.
- toMin: lower boundry of the target range.
- toMax: upper boundry of the target range.

#### Subsequent calls

- value: datum from the source range to be mapped into the target range.

### Return Value

When the input value is from the source range, a value in the target range is returned, otherwise unknown.

## [normaliseRange](:#normaliserange)

The _normaliseRange_ function takes in the _min_ and _max_ values of a range within which future values are to be normalised, and returns a specialised function.

When the specialised function is called with a value within the range the result is a value proportional to the range (between 0 and 1.)

Input values outside the expected range will be either less than 0 or greater than 1, but still proportional.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- start: lower boundry of the range.
- end: upper boundry of the range.

#### Subsequent calls

- value: datum to be normalised (set to a value between 0 and 1 proportional to the given range.)

### Return Value

A value between 0 and 1.

## [range](:#range)

_Range_ is a function that produces an array of _size_ numbers between zero and _size_ - 1.

```javascript
Utilities.rangeBetween(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeBetween(20, 10); // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

Utilities.rangeBetween(20, 10, 3); // [10, 13, 16, 19]
```

### Parameters

- size: The number of values in the output array.
- transform: An optional transform function that is applied to each value in the generated array using a _map_ method.

### Return Value

A new array containing _size_ values as transformed by the optionally supplied function.

## [rangeBetween](:#rangebetween)

_RangeBetween_ is a function that produces an array of numbers between _min_ and _max (- 1)_ in _step_ intervals (default value is 1.)

```javascript
Utilities.rangeBetween(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeBetween(20, 10); // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

Utilities.rangeBetween(20, 10, 3); // [10, 13, 16, 19]
```

### Parameters

- max: one more than the upper boundry of the range.
- min: lower boundry of the range (defaulted to 0.)
- step: size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing the numbers between _min_ and _max - 1_, in _step_ intervals.

## [rangeFrom](:#rangefrom)

Similar to the _RangeBetween_ function, this function generates an array of _len_ numbers commencing with _init_ and varying by _step_. The _step_ parameter can be a fixed value (defaulted to 1) or a function using the index (starting from zero) as its input.

```javascript
Utilities.rangeFrom(); // [0]

Utilities.rangeFrom(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeFrom(12, 10); // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

Utilities.rangeFrom(12, 10, 2); // [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]

const fn = (x) => 2 * x;
Utilities.rangeFrom(12, 10, fn); // [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]
```

### Parameters

- init: initial value of the range.
- len: number of values in the outputrange.
- step: size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing _len_ numbers starting from _init_, in _step_ intervals.

## [rangeGenerator](:#rangegenerator)

A generator function for the production of a prepopulated array or itterable.

```javascript
Utilities.rangeGenerator(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeGenerator(10, 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeGenerator(10, 1, 2); // [1, 3, 5, 7, 9]

Utilities.rangeGenerator(10, 0, 2); // [0, 2, 4, 6, 8, 10]

for (i of Utilities.rangeGenerator(10, 0, 2)) {
  console.log(i);
}

// Output: 0, 2, 4, 6, 8, 10
```

### Parameters

- end: the highest number in the range of numbers in the array.
- start: optional (defaulted to 0) the value of the first item in the output array.
- step: optional (defaulted to 1) the size of increment between values in the array

### Return value

An array of numbers starting with the _start_ value and ending with the nearest value less than or equal to _end_, in increments of _step_.

---
