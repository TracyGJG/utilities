# Utilities

A collection of utility functions I find useful.

- acculatedAverage
- clampRange
- normaliseRange
- liniarInterpolate
- mapRanges
- rangeBetween
- rangeFrom
- inRange
- loopRange
- intersectArrays
- unionArrays
- exercise
- base64encoding
- base64decoding
- shortDay
- longDay
- shortMonth
- longMonth
- objectEqual
- caseConverter

The above functions make considerable use of the technique called currying to return a specialised function. This saves on suppling parameters that are not expected to change.

### NB: The functions have been prepared with no input validation or additional error checking.

## Update: 5th September 2020
This library was originally developed as an ES Module but had to be converted to Common.JS to make it compatible and testable with Jest.
Following the advice given in [Valentino Gagliardi's article](https://www.valentinog.com/blog/jest/), I have been able to to convert it back to an ES Module; making it usable by Node and in the web browser.

---

## acculatedAverage

### Parameters

#### Initial call

- averageToDate: Current average before the new Value arrived. (defaulted to 0)
- sampleSize: Number of values in the sample, including the new Value. (defaulted to 0)

#### Subsequent calls

- newValue - New data point to be included in the average calculation.
- newAverge - Replacement value of the averageToDate. (optional)
- newSampleSize - Replacement value of the sampleSize. (optional)

### Return Value

The new calculated average.

### Description

Utility for recalculating an average as the sample size increased. There are two ways of using the function, one-off and incremental, but both employ partial application.

One-off, involves calling acculmulateAverage with the current average and the size of the sample (number of values from which the average is calculated.) This provides the partial application (specilised function) that can then be called with the value to the included in the average.

`Utility.accumulatedAverage(currentAverage, sampleSize)(newValue)`

The incremental appraoch of using the function involves placing the initial call without parameters (or with the defaults), to get the specialised function.

`var accumulateAverage = Utility.accumulatedAverage();`

`var newAverage = accumulateAverage(newSample)); // newAverage = (0 + newSample) / (0 + 1)`

Subsequent calls to accumulateAverage with include additional values as part of the new average.

---

## clampRange

### Parameters

#### Initial call

- min - lower boundry of the range.
- max - upper boundry of the range.

#### Subsequent calls

- value - datum to be clamped.

### Return Value

A value within the clamped range.

### Description

Function that restricts a value to within a given numeric range. Initialised with the lower and upper boundries of a range, this function returns another specialised function.

When the specialised function is called with a single number, the value may be changed to bring it within the predefined range.

If the input value is below the lower boundries the output from the function will be the lower boundary. Likewise, if the input value is above the upper boundries the output from the function will be the upper boundary.

If the input value is within the boundries the output from the function will be the input value.

---

## normaliseRange

### Parameters

#### Initial call

- start - lower boundry of the range.
- end - upper boundry of the range.

#### Subsequent calls

- value - datum to be normalised (set to a value between 0 and 1 proportional to the given range.)

### Return Value

A value between 0 and 1.

### Description

The NormaliseRange function takes in the min and max values of a range in which future values are to be normalised, and returns a specialised function.

When the specialised function is called with a value within the range the result is a value proportional to the range (between 0 and 1.)

Input values outside the expected range will be either less than 0 or greater than 1.

---

## liniarInterpolate

### Parameters

#### Initial call

- start - lower boundry of the range.
- end - upper boundry of the range.

#### Subsequent calls

- value - datum (between 0 and 1) to be interpolated.

### Return Value

A value between the start and end values, proportional to the input value.

### Description

This function converts a normalised value (beweet 0 and 1), and initilised with a given range, returns a value within the range proportional to the input value.

---

## mapRanges

### Parameters

#### Initial call

- fromMin - lower boundry of the source range.
- fromMax - upper boundry of the source range.
- toMin - lower boundry of the target range.
- toMax - upper boundry of the target range.

#### Subsequent calls

- value - datum from the source range to be mapped into the target range.

### Return Value

A value in the target range, when the input value is from the source range, otherwise unknown.

### Description

The Map Ranges function is quite self explanatory. Initialised with a source and target range, and given an input value (within the source range), it returns a value in the target range with the same normalised proportion.

---

## rangeBetween

### Parameters

- min - lower boundry of the range.
- max - upper boundry of the range.
- step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing the numbers between min and max - 1, in step intervals.

### Description

RangeBetween is a generator function that produces an array of numbers between _min_ and _max_ (- 1) in _step_ intervals (default value is 1.)

---

## rangeFrom

### Parameters

- init - initial value of the range.
- len - number of values in the outputrange.
- step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing len numbers starting from init, in step intervals.

A new array containing the a numbers.

### Description

Similar to the RangeBetween function, this function generates an array of len numbers commencing with init and varying by step. The step parameter can be a fixed value (defaulted to 1) or a function using the index as an input.

---

## inRange

### Parameters

#### Initial call

- from - lower boundry of the primary range.
- to - upper boundry of the primary range.

#### Subsequent calls

- from - lower boundry of the secondary range.
- to - upper boundry of the secondary range (optional).

### Return Value

Boolean value indicating the ranges overlap or a value is within a given range.

### Description

This function supports two use cases:
1 Confirm two ranges overloap.
2 Confirm a value lies within a primary range.

---

## loopRange

### Parameters

#### Initial call

- max - maximum output value of the range.
- min - minimal output value of the range (optional, defaulted to zero).

#### Subsequent calls

- cur - Current value within the range.
- dir - Direction of change (1 to increase and -1 to decrease.)

### Return Value

Calculated new value within the range.

### Description

Calculates a new value in a sequence based on the current (_cur_) input. The value increases or decreases based on the direction (_dir_) value (1 to increase, -1 to decrease.) The value changes within a defined range up to a maximum (_max_) and minimum (_min_), which is an optional input with a default of zero.

When the value exceeds the bounds of the range it loops round to the opposite end of the range.

---

## intersectArrays

### Parameters

- arrays - One or more arrays from which the intersect is to be extracted.

### Return Value

A new array containing only those values found in all the given arrays.

### Description

Extracts the common values of all the input arrays into a new array of distinct values.

---

## unionArrays

### Parameters

- arrays - One or more arrays from which the union is to be extracted.

### Return Value

A new array containing a distinct list of values from all of the given arrays.

### Description

Extracts a list of all the values from the input arrays into a new array of distinct values.

---

## exercise

### Parameters

- expected - The value anticipated to be the result.
- actual - The value calculated as the result.
- id - Reference for the specific exercise. (optional)

### Return Value

Result of the comparison (true or false.)

### Description

A simple mechanism for ad-hoc testing of a pure function.

---

## Base 64 Encoding

### Parameters

- Raw data such as a binary buffer

### Return Value

Base 64 encoded version of the input raw data.

### Description

Applies Base64 encoding of supplied data.

---

## Base 64 Decoding

### Parameters

- Data in Base64 encoding

### Return Value

Decodes version of the Base64 encoded input data.

### Description

Applies Base64 decoding of supplied encloded data.

---

## Date Strings - Short Day

### Parameters

- lang - Locale string (defaulted to gb-GB)
- idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the day of week in the language of the given locale code.

### Description

Provides the short form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

---

## Date Strings - Long Day

### Parameters

- lang - Locale string (defaulted to gb-GB)
- idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the day of week in the language of the given locale code.

### Description

Provides the long form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

---

## Date Strings - Short Month

### Parameters

- lang - Locale string (defaulted to gb-GB)
- idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the month of year in the language of the given locale code.

### Description

Provides the short form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

---

## Date Strings - Long Month

### Parameters

- lang - Locale string (defaulted to gb-GB)
- idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the month of year in the language of the given locale code.

### Description

Provides the long form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

---

## Object Equality

### Parameters

- obj1 - first object in comparison
- obj2 - second object in comparison

### Return Value

Boolean flag indication if the values held withint _obj1_ are the same as those in _obj2_.

### Description

Performs a comparison of all the values in the properties of both of the objects supplied.

---

## Case Converter

### Parameters

#### Initial call

- case - The type of text conversion to be performed (use the Utilities constants.)

#### Subsequent calls

- sub - Subject string to be converted.

### Return Value

The converted string.

### Description

Converts input strings according to a pre-defined format.

- CASE_C: camelCase: The first word is all lowercase with the remaining words all capitalised. All separation is removed (spaces, hyphens and underscores.)
- CASE_G: GLOBAL_CASE; All text is uppercase and all separators made underscores.
- CASE_H: Heading Case, where each word is changed to leading letter uppercase, rest lowercase. Hyphes and spaces are preserved but duplicates are removed.
- CASE_K: kabab-case; All lowercase text with hyphen separation only.
- CASE_L: lower case; All text is converted to lowercase, duplicate separators reduced but retained.
- CASE_P: PascalCase; Like Camel-case but even the first word is capitalised.
- CASE_T: Title Case; like Heading case but preserving acronyms in all upper case (this is the default.)
- CASE_U: UPPER CASE; All text is converted to uppercase, duplicate separators reduced to single characters but retained.

#### Examples

Example text "This\_\_is \ an \ EXAMPLE test--case"

- Camel case: "thisIsAnExampleTestCase"
- Global case: "THIS_IS_AN_EXAMPLE_TEST_CASE"
- Heading case: "This Is An Example Test-case"
- Kabab case: "this-is-an-example-test-case"
- Lower case: "this_is an example test-case"
- Pascal case: "ThisIsAnExampleTestCase"
- Title case: "This Is An EXAMPLE Test-case"
- Upper case: "THIS_IS AN EXAMPLE TEST-CASE"

---
