# Utilities

A collection of utility functions I find useful.

|                 Ranges                  |                                   |
| :-------------------------------------: | :-------------------------------: |
|  [acculatedAverage](#acculatedAverage)  |                                   |
|        [clampRange](#clampRange)        | [normaliseRange](#normaliseRange) |
| [liniarInterpolate](#liniarInterpolate) |      [mapRanges](#mapRanges)      |
|      [rangeBetween](#rangeBetween)      |      [rangeFrom](#rangeFrom)      |
|           [inRange](#inRange)           |      [loopRange](#loopRange)      |

|               Arrays                |                                   |
| :---------------------------------: | :-------------------------------: |
| [intersectArrays](#intersectArrays) |    [unionArrays](#unionArrays)    |
|    [replaceArray](#replaceArray)    | [reconcileArray](#reconcileArray) |
|  [transposeArray](#transposeArray)  |        [groupBy](#groupBy)        |

|          Data Converters          |                                   |
| :-------------------------------: | :-------------------------------: |
| [base64encoding](#base64encoding) | [base64decoding](#base64decoding) |
|       [shortDay](#shortDay)       |        [longDay](#longDay)        |
|     [shortMonth](#shortMonth)     |      [longMonth](#longMonth)      |

|     Data Comparison and Cloning     |                                                     |
| :---------------------------------: | :-------------------------------------------------: |
|  [objectEquality](#objectEquality)  |                [dataType](#dataType)                |
|     [cloneObject](#cloneObject)     |         [duplicateObject](#duplicateObject)         |
| [extractProperty](#extractProperty) | [compareObjectByProperty](#compareObjectByProperty) |

|      Exercising       |                               |
| :-------------------: | :---------------------------: |
| [exercise](#exercise) | [consoleTable](#consoleTable) |

|        Tools        |                         |
| :-----------------: | :---------------------: |
|   [sleep](#sleep)   |      [lens](#lens)      |
| [memoise](#memoise) |     [curry](#curry)     |
| [compose](#compose) | [enumerate](#enumerate) |

The above functions make considerable use of the technique called currying to return a specialised function. This saves on suppling parameters that are not expected to change.

### NB: The functions have been prepared with no input validation or additional error checking.

## Change Log

### Update 1st October 2022

-   Enhance the `enumerate` function to support capitalisation of snake and sentence|title case keys.

### Update 29th August 2022

-   Added Array 'groupBy' function.

### Update 20th August 2022

-   Added `enumerate` to generate an object to support Enumeration in JS.
-   Removed `caseConverter` as it is of very little utility.

### Update 22nd April 2022

-   Added `compose` to combine a list of monadic (single parameter) functions into a single new function.

### Update 24th January 2022

-   Added `duplicateObject` to create an in-depth copy of an object including properties of data types not supported by JSON.

### Update 13th October 2021

-   Added `extractProperty` to extract objects/values from a containing object given a path of property names.
-   Refinement of the `compareObjectByProperty` method.

### Update: 21st September 2021

Added `compareObjectByProperty` to generate an object comparator function based on a given property name.

### Update: 22nd August 2021

Added `cloneObject` to enable deep duplication of objects including data types not supported by JSON.

### Update: 19th August 2021

Added `transposeArray` to pivot the rows with columns of a 2D array.

### Update: 11th August 2021

Added `reconcileArray` to update an array based on a second without losing reference.

### Update: 7th July 2021

Added `memoise` and `curry` functions.

### Update: 5th June 2021

Added `sleep` function.

### Update: 17th April 2021

Revised `unionArrays` function.

### Update: 3rd April 2021

Applied patch to address the report by Snyk of a vulnerability in the y18n package version 4.0.0.

### Update: 5th March 2021

New function `replaceArray` added to replace the content of an array in place, without reassignment.

### Update: 29th December 2020

New function `dataType` added to report the type of data held in a variable as a string.

### Update: 5th September 2020

This library was originally developed as an ES Module but had to be converted to Common.JS to make it compatible and testable with Jest.
Following the advice given in [Valentino Gagliardi's article](https://www.valentinog.com/blog/jest/), I have been able to to convert it back to an ES Module; making it usable by Node and in the web browser.

---

# Ranges

## [acculatedAverage](:#acculatedAverage)

### Parameters

#### Initial call

-   averageToDate: Current average before the new Value arrived. (defaulted to 0)
-   sampleSize: Number of values in the sample, including the new Value. (defaulted to 0)

#### Subsequent calls

-   newValue - New data point to be included in the average calculation.
-   newAverge - Replacement value of the averageToDate. (optional)
-   newSampleSize - Replacement value of the sampleSize. (optional)

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

## [clampRange](:#clampRange)

### Parameters

#### Initial call

-   min - lower boundry of the range.
-   max - upper boundry of the range.

#### Subsequent calls

-   value - datum to be clamped.

### Return Value

A value within the clamped range.

### Description

Function that restricts a value to within a given numeric range. Initialised with the lower and upper boundries of a range, this function returns another specialised function.

When the specialised function is called with a single number, the value may be changed to bring it within the predefined range.

If the input value is below the lower boundries the output from the function will be the lower boundary. Likewise, if the input value is above the upper boundries the output from the function will be the upper boundary.

If the input value is within the boundries the output from the function will be the input value.

---

## [normaliseRange](:#normaliseRange)

### Parameters

#### Initial call

-   start - lower boundry of the range.
-   end - upper boundry of the range.

#### Subsequent calls

-   value - datum to be normalised (set to a value between 0 and 1 proportional to the given range.)

### Return Value

A value between 0 and 1.

### Description

The NormaliseRange function takes in the min and max values of a range in which future values are to be normalised, and returns a specialised function.

When the specialised function is called with a value within the range the result is a value proportional to the range (between 0 and 1.)

Input values outside the expected range will be either less than 0 or greater than 1.

---

## [liniarInterpolate](:#liniarInterpolate)

### Parameters

#### Initial call

-   start - lower boundry of the range.
-   end - upper boundry of the range.

#### Subsequent calls

-   value - datum (between 0 and 1) to be interpolated.

### Return Value

A value between the start and end values, proportional to the input value.

### Description

This function converts a normalised value (beweet 0 and 1), and initilised with a given range, returns a value within the range proportional to the input value.

---

## [mapRanges](:#mapRanges)

### Parameters

#### Initial call

-   fromMin - lower boundry of the source range.
-   fromMax - upper boundry of the source range.
-   toMin - lower boundry of the target range.
-   toMax - upper boundry of the target range.

#### Subsequent calls

-   value - datum from the source range to be mapped into the target range.

### Return Value

A value in the target range, when the input value is from the source range, otherwise unknown.

### Description

The Map Ranges function is quite self explanatory. Initialised with a source and target range, and given an input value (within the source range), it returns a value in the target range with the same normalised proportion.

---

## [rangeBetween](:#rangeBetween)

### Parameters

-   max - one more than the upper boundry of the range.
-   min - lower boundry of the range (defaulted to 0.)
-   step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing the numbers between min and max - 1, in step intervals.

### Description

RangeBetween is a generator function that produces an array of numbers between _min_ and _max_ (- 1) in _step_ intervals (default value is 1.)

---

## [rangeFrom](:#rangeFrom)

### Parameters

-   init - initial value of the range.
-   len - number of values in the outputrange.
-   step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing len numbers starting from init, in step intervals.

### Description

Similar to the RangeBetween function, this function generates an array of len numbers commencing with init and varying by step. The step parameter can be a fixed value (defaulted to 1) or a function using the index as an input.

---

## [inRange](:#inRange)

### Parameters

#### Initial call

-   from - lower boundry of the primary range.
-   to - upper boundry of the primary range.

#### Subsequent calls

-   from - lower boundry of the secondary range.
-   to - upper boundry of the secondary range (optional).

### Return Value

Boolean value indicating the ranges overlap or a value is within a given range.

### Description

This function supports two use cases:

1. Confirm two ranges overloap.
2. Confirm a value lies within a primary range.

---

## [loopRange](:#loopRange)

### Parameters

#### Initial call

-   max - maximum output value of the range.
-   min - minimal output value of the range (optional, defaulted to zero).

#### Subsequent calls

-   cur - Current value within the range.
-   dir - Direction of change (1 to increase and -1 to decrease.)

### Return Value

Calculated new value within the range.

### Description

Calculates a new value in a sequence based on the current (_cur_) input. The value increases or decreases based on the direction (_dir_) value (1 to increase, -1 to decrease.) The value changes within a defined range up to a maximum (_max_) and minimum (_min_), which is an optional input with a default of zero.

When the value exceeds the bounds of the range it loops round to the opposite end of the range.

---

# Arrays

## [intersectArrays](:#intersectArrays)

### Parameters

-   arrays - One or more arrays from which the intersect is to be extracted.

### Return Value

A new array containing only those values found in all the given arrays.

### Description

Extracts the common values of all the input arrays into a new array of distinct values.

---

## [unionArrays](:#unionArrays)

### Parameters

-   arrays - One or more arrays from which the union is to be extracted.

### Return Value

A new array containing a distinct list of values from all of the given arrays.

### Description

Extracts a list of all the values from the input arrays into a new array of distinct values.

---

## [replaceArray](:#replaceArray)

### Parameters

-   targetArray - Reference to the array to be replaced.
-   arrayContent - Optional reference to an array containing data to populate the target array.

### Return Value

None - updates the targetArray directly by reference.

### Description

Replaces the content of the targetArray with the (optional) content of the arrayContent.

---

## [reconcileArray](:reconcileArray)

### Parameters

-   sourceArray - Reference to an Object Array containing content to by used to update the primary array.
-   targetArray - Reference to an Object Array to be updated without losing reference.
-   objectKey - Optional string (defaulted to 'id') name of the property of all objects in the array that act as a unique identifier.

### Return Value

None - updates the targetArray directly by reference.

### Description

Replaces the content of the targetArray with content from the sourceArray using the objectKey to locate common objects. Object in the sourceArray but not in target are added, those in target but not source are removed. Objects that appear in both arrays, as identified by the objectKey property, are updated with any array properties also preserved.

---

## [transposeArray](:#transposeArray)

### Parameters

-   The original 2D array.

e.g. [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2'], ['A3', 'B3', 'C3']]

|  I/P  | col 1 | col 2 | col 3 |
| :---: | :---: | :---: | :---: |
| row 1 |  A1   |  B1   |  C1   |
| row 2 |  A2   |  B2   |  C2   |
| row 3 |  A3   |  B3   |  C3   |

### Return Value

A new array with the rows and columns from the input array transposed.

e.g. [['A1', 'A2', 'A3'], ['B1', 'B2', 'B3'], ['C1', 'C2', 'C3']]

|  O/P  | col 1 | col 2 | col 3 |
| :---: | :---: | :---: | :---: |
| row 1 |  A1   |  A2   |  C3   |
| row 2 |  B1   |  B2   |  B3   |
| row 3 |  C1   |  C2   |  C3   |

### Description

Takes a 2-dimensional array (matrix) and produces a new array where the rows of the initial array become the columns of the new array and vice-a-verse.

---

## [groupBy](:groupBy)

### Parameters

-   Function the identifies the group of a object in the array
-   Source array of objects

The arguments can be supplied at the same time or one at a time.

### Return Value

An object with a property for each group found. Each property has an array of objects as its value.

### Description

Given a source array of objects and a function used to identify to which group an object belongs, this function creates an obejct with a property for each group of objects.

---

# Data Converters

## [base64encoding](:#base64encoding)

### Parameters

-   Raw data such as a binary buffer

### Return Value

Base 64 encoded version of the input raw data.

### Description

Applies Base64 encoding of supplied data.

---

## [base64Decoding](:#base64decoding)

### Parameters

-   Data in Base64 encoding

### Return Value

Decodes version of the Base64 encoded input data.

### Description

Applies Base64 decoding of supplied encloded data.

---

## Date Strings

### [shortDay](:#shortDay)

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the day of week in the language of the given locale code.

### Description

Provides the short form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

---

### [longDay](:#longDay)

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the day of week in the language of the given locale code.

### Description

Provides the long form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

---

### [shortMonth](:#shortMonth)

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the month of year in the language of the given locale code.

### Description

Provides the short form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

---

### [longMonth](:#longMonth)

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the month of year in the language of the given locale code.

### Description

Provides the long form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

---

# Data Comparison and Cloning

## [objectEquality](:#objectEquality)

### Parameters

-   obj1 - first object in comparison
-   obj2 - second object in comparison

### Return Value

Boolean flag indication if the values held withint _obj1_ are the same as those in _obj2_.

### Description

Compares two objects and reports in they are equivalent (contain the same primitives.)

---

## [cloneObject](:#cloneObject)

### Parameters

-   obj - source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values.

### Description

Creates a renew object with the same structure of the input, containing copies of the primitive values.

---

## [duplicateObject](:#duplicateObject)

### Parameters

-   obj - source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values and more complicated objects.

### Description

Creates a renew object with the same structure of the input, containing copies of the primitive values and objects such as RegExp, Date and Function.

---

## [compareObjectByProperty](:#compareObjectByProperty)

### Parameters

-   propertyName - string - name of the property to be used to compare objects in a sort method.
-   ascending - boolean - optional (defaulted to true) indication or the required sort order.

### Return Value

A comparator function used to sort objects containing the given property.

### Description

Creates a comparator function for use with an array of objects containing the given property.

---

## [extractProperty](:#extractProperty)

### Parameters

-   propertyNames - a series of property names (strings) provided as arguments that define the path within an object from where the value/object can be extracted.

### Return Value

A extractor function that returns the value/object from a given object, using the intial property path.

### Description

Creates an extractor function that, given an object, will use the list of property names to extract the end property value/object.

---

## [dataType](:#dataType)

### Parameters

-   subject variable of any type.

### Return Value

Lowercase string representation of the type of data held in the variable. This includes the following:

| Standard Types |        |
| :------------: | :----: |
|   undefined    |  null  |
|    boolean     | number |
|     string     | object |
|     array      | regexp |
|      date      | error  |
|      set       |  map   |
|     symbol     | bigint |

### Description

Performs a comparison of all the values in the properties of both of the objects supplied.

---

# Exercising

## [exercise](:#exercise)

### Parameters

-   expected - The value anticipated to be the result.
-   actual - The value calculated as the result.
-   id - Reference for the specific exercise. (optional)

### Return Value

Result of the comparison (true or false.)

### Description

A simple mechanism for ad-hoc testing of a pure function.

---

## [consoleTable](:#consoleTable)

### Parameters

-   arr - an array of values, objects or array's of primitives.
-   domNode - (optional) target, defaulted to the document.body.

### Return Value

None.

### Description

An alternative to the console.table function but generates HTML.

---

# Tools

## [sleep](:sleep)

### Parameters

-   ms - delay in milliseconds (1/1000th of a second)

### Return Value

None

### Description

Delays processing of the current thread or a set period of time (approximately.)

---

## [memoise](:#memoise)

### Parameters

-   fn - pure function to convert into a memoised function.
-   \_cache - private cache of function executions.

### Return Value

A memoised function.

### Description

Converts the given pure function into on that is optimised using memoisation (caching.)

---

## [curry](:#curry)

### Parameters

-   fn - variadic function to convert into a curried function.
-   \_args - private array of arguments accumulated prior to execution.

### Return Value

A curried function.

### Description

Converts the given variadic function into one that expects arguments to be supplied one at a time.

---

## [lens](:#lens)

### Parameters

-   props - one or more propertyNames or array subscripts, either individually or in strings.

### Return Value

A lookup function to return the value of a property at the stated location, for a given object.

### Description

Creates a repeatable function for extracting values out of objects/arrays at a given location (property/subscript).

---

## [compose](:#compose)

### Parameters

-   args - a number of monadic (single parameter) functions.

### Return Value

A new monadic function that is a combination of all those provided.

### Description

Combines a list of monadic (single parameter) functions into a single new function that expects a single input parameter.

---

## [enumerate](:#enumerate)

### Parameters

-   source - an array or object to be used to extract the enumeration labels and values.
-   options - an optional structure used to instruct the function of its behaviour.
-   -   constantProperties - Boolean flag; true to convert, false (default) to leave as is.
-   -   numericValues - Boolean flag: true to provide incremental numeric values, false (default) to use the original keys.

### Return Value

An object containing the enumerated values.

### Exceptions

-   E-IS The source argument supplied is not an Array or an Object.
-   E-NP The source argument supplied is not populated.
-   E-NS The source argument supplied is not populated with string keys.
-   E-NR The option '${option}' is not a recognised option.
-   E-NB The option '${option}' is not a Boolean value.

### Description

Extracts keys from the source to construct an object of enumerated values. The value of each enumeration can be the same as the original key or a number increamenting from 0.
Options enable the enumeration keys to be converted to GLOBAL_CASE, or configure the values as numeric.

#### Use Cases

1. Create an object from an array of strings to be used as an Enumeration set.
2. Create a lookup object of constants (strings) that maps to properties of a function map obejcts.

---
