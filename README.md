# Utilities

A collection of 50 utility functions I find useful.

<!-- #region Collection -->

|  Ancillary                            |                                                     |                                         |
| :-----------------------------------: | :-------------------------------------------------: | :-------------------------------------: |
| [acculatedAverage](#acculatedAverage) | [mapGetter](#mapGetter)                             | [random](#random)                       |
|              [sum](#sum)              |  [webStore](#webStore)                              |                                         |
|                                       |                                                     |                                         |
|           **Arrays**                  |                                                     |                                         |
|      [groupBy](#groupBy)              | [intersectArrays](#intersectArrays)                 | [reconcileArray](#reconcileArray)       |
| [replaceArray](#replaceArray)         |  [transposeArray](#transposeArray)                  |    [unionArrays](#unionArrays)          |
|                                       |                                                     |                                         |
|   **Data Comparison and Cloning**     |                                                     |                                         |
|     [cloneObject](#cloneObject)       | [compareObjectByProperty](#compareObjectByProperty) |      [dataType](#dataType)              |
| [duplicateObject](#duplicateObject)   |         [extractProperty](#extractProperty)         | [isEmptyObject](#isEmptyObject)         |
|  [objectEquality](#objectEquality)    |                                                     |                                         |
|                                       |                                                     |                                         |
|        **Data Converters**            |                                                     |                                         |
| [base64decoding](#base64decoding)     | [base64encoding](#base64encoding)                   |    [longDay](#longDay)                  |
|      [longMonth](#longMonth)          |       [shortDay](#shortDay)                         | [shortMonth](#shortMonth)               |
|                                       |                                                     |                                         |
| **Document Object Model (DOM)**       |                                                     |                                         |
| [ace](#ace)                           | [ael](#ael)                                         | [cde](#cde)                             |
| [cse](#cse)                           | [qs](#qs)                                           | [qsa](#qsa)                             |
|                                       |                                                     |                                         |
|       **Exercising**                  |                                                     |                                         |
| [adhocArray](#adhocArray)             | [consoleGroup](#consoleGroup)                       | [consoleTable](#consoleTable)           |
| [exercise](#exercise)                 |                                                     |                                         |
|                                       |                                                     |                                         |
|          **Ranges**                   |                                                     |                                         |
|   [clampRange](#clampRange)           |   [inRange](#inRange)                               | [liniarInterpolate](#liniarInterpolate) |
|    [loopRange](#loopRange)            | [mapRanges](#mapRanges)                             |    [normaliseRange](#normaliseRange)    |
| [rangeBetween](#rangeBetween)         | [rangeFrom](#rangeFrom)                             |                                         |
|                                       |                                                     |                                         |
|      **Tools**                        |                                                     |                                         |
|   [compose](#compose)                 | [copyText](#copyText)                               | [curry](#curry)                         |
| [enumerate](#enumerate)               | [lens](#lens)                                       | [memoise](#memoise)                     |
| [pasteText](#pasteText)               | [sleep](#sleep)                                     |                                         |
|                                       |                                                     |                                         |

The above functions make considerable use of the technique called currying/partial-application to return a specialised function. This saves on suppling parameters that are not expected to change.

### NB: The functions have been prepared with no input validation.

---
<!-- #endregion --> 

# Ancillaries

## [acculatedAverage](:#acculatedAverage)

Utility for recalculating an average as the sample size increased. There are two ways of using the function, one-off and incremental, but both employ partial application.

One-off, involves calling _acculmulateAverage_ with the current average and the size of the sample (number of values from which the average is calculated.) This provides the partial application (specialised function) that can then be called with the value to be included in the average.

`Utility.accumulatedAverage(currentAverage, sampleSize)(newValue)`

The incremental appraoch of using the function involves placing the initial call without parameters (or with the defaults), to get the specialised function.

`const accumulateAverage = Utility.accumulatedAverage();`

`const newAverage = accumulateAverage(newSample)); // newAverage = (0 + newSample) / (0 + 1)`

Subsequent calls to _accumulateAverage_ with include additional values as part of the new average.

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

## [mapGetter](:#mapGetter)

Utility for creating and retrieving entities from a map object.

### Parameters

#### Initial call

-   mapInstance: The map instance potentially containing an entity. 
-   entityFactory: Function for creating a new entity when not found in the map.

#### Subsequent calls

-   entityId - The Id of the entity to be retrieved from the map or created.
-   entityParams - An object containing additional paraeters required to create an entity. (optional)

### Return Value

The entity retrieved from the map or created anew.

## [random](:#random)

Generates a number within the given range and to the stipulated precision.

### Parameters

-   max - Highest value of the random range
-   min - Lowest value of the random range (default 0)
-   precision - Number of decimal digits allowed in the random value as a power of 10 (default 0 = 10^0)

### Return Value

A function that generates a random value within the `min` and `max` range with a given decimal precision.

## [sum](:#sum)

Calculates the sum of all arguments supplied.

### Parameters

-   ...nums - a (rest) array of numbers.

### Return Value

The sum of all the provided values.

### Exceptions

| Code | Description                   |
| :--: | :---------------------------: |
| E-NN | _Non-numeric value supplied._ |

## [webStore](:#webStore)

Provides an object of web storage utility methods.

### Parameters

-   keyName - storage key
-   localWebStorage - flag indicating the type of web storage (default true = localStorage, false = sessionStorage)

### Return Value

An object of functions for the manipulation of data in Web Storage.

-   clear: Wipes all keys and values from web storage.
-   get: Retrieves the value from web storage with the previously given key.
-   remove: Wipes the specified key and value from the web storage.
-   set: Stores the value in web storage with the previously given key.

---

# Arrays

## [groupBy](:groupBy)

Given a source array of objects and a function used to identify to which group an object belongs, this function creates an obejct with a property for each group of objects.

### Parameters

-   Function that identifies the group of an object in the array
-   Source array of objects

The arguments can be supplied at the same time or one at a time.

### Return Value

An object with a property for each group found. Each property has an array of objects as its value.

## [intersectArrays](:#intersectArrays)

Extracts the common values of all the input arrays into a new array of distinct values.

```
Utilities.intersectArrays([1, 2, 3, 4], [3, 4, 5, 6]); // [3, 4]
```

### Parameters

-   arrays - One or more arrays from which the intersect is to be extracted.

### Return Value

A new array containing only those values found in all the given arrays.

## [reconcileArray](:reconcileArray)

Replaces the content of the _targetArray_ with content from the _sourceArray_ using the _objectKey_ to locate common objects. Object in the _sourceArray_ but not in target are added, those in target but not source are removed. Objects that appear in both arrays, as identified by the _objectKey_ property, are updated with any array properties also preserved.

### Parameters

-   sourceArray - Reference to an Object Array containing content to by used to update the primary array.
-   targetArray - Reference to an Object Array to be updated without losing reference.
-   objectKey - Optional string (defaulted to 'id') name of the property of all objects in the array that act as a unique identifier.

### Return Value

None - updates the targetArray directly by reference.

## [replaceArray](:#replaceArray)

Replaces the content of the _targetArray_ with the (optional) content of the _arrayContent_.

### Parameters

-   targetArray - Reference to the array to be replaced.
-   arrayContent - Optional reference to an array containing data to populate the target array.

### Return Value

None - updates the _targetArray_ directly by reference.

## [transposeArray](:#transposeArray)

Takes a 2-dimensional array (matrix) and produces a new array where the rows of the initial array become the columns of the new array and vice-a-verse.

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

## [unionArrays](:#unionArrays)

Extracts a list of all the values from the input arrays into a new array of distinct values.

```
Utilities.unionArrays([1, 2, 3, 4], [3, 4, 5, 6]); // [1, 2, 3, 4, 5 ,6]
```

### Parameters

-   arrays - One or more arrays from which the union is to be extracted.

### Return Value

A new array containing a distinct list of values from all of the given arrays.

---

# Data Comparison and Cloning

This module exposes a constant object `DATA_TYPES` that is a collection of enumerated values representing the data types and values supported by JS.

| Enum    | data type | Enum    | data type | Enum    | data type |
| :-----: | :-------: | :-----: | :-------: | :-----: | :-------: |
|ARRAY    | array     |FUNCTION | function  |REGEXP   | regexp    |
|BIGINT   | bigint    |MAP      | map       |SET      | set       |
|BOOLEAN  | boolean   |NULL     | null      |STRING   | string    |
|DATE     | date      |NUMBER   | number    |SYMBOL   | symbol    |
|ERROR    | error     |OBJECT   | object    |UNDEFINED| undefined |

## [cloneObject](:#cloneObject)

Creates a renew object with the same structure of the input, containing copies of the primitive values.

### Parameters

-   obj - source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values.

## [compareObjectByProperty](:#compareObjectByProperty)

Creates a comparator function for use with an array of objects containing the given property.

### Parameters

-   propertyName - string - name of the property to be used to compare objects in a sort method.
-   ascending - boolean - optional (defaulted to true) indication or the required sort order.

### Return Value

A comparator function used to sort objects containing the given property.

## [dataType](:#dataType)

Identifies which of the above Standard data Type being used by the supplied argument.   

### Parameters

-   subject variable of any type.

### Return Value

Lowercase string representation of the type of data held in the variable. This includes the following:

| Standard Values    |        |        |
| :----------------: | :----: | :----: |
|   undefined        |  null  |        |
|                    |        |        |
| **Standard Types** |        |        |
|    boolean         | number | string |
|    object          | array  | regexp |
|    date            | error  | set    |
|    map             | symbol | bigint |

## [duplicateObject](:#duplicateObject)

Creates a renew object with the same structure of the input, containing copies of the primitive values and objects such as RegExp, Date and Function.

### Parameters

-   obj - source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values and more complicated objects.

## [extractProperty](:#extractProperty)

Creates an extractor function that, given an object, will use the list of property names to extract the end property value/object.

### Parameters

-   propertyNames - a series of property names (strings) provided as arguments that define the path within an object from where the value/object can be extracted.

### Return Value

A extractor function that returns the value/object from a given object, using the intial property path.

## [isEmptyObject](:#isEmptyObject)

Compares two objects and reports in they are equivalent (contain the same primitives.)

### Parameters

-   obj - An object that could be empty, populated, null or undefined.

### Return Value

Boolean flag indication if the value is an object, null or undefined.

## [objectEquality](:#objectEquality)

Compares two objects and reports in they are equivalent (contain the same primitives.)

### Parameters

-   obj1 - first object in comparison
-   obj2 - second object in comparison

### Return Value

Boolean flag indication if the values held withint _obj1_ are the same as those in _obj2_.

# Data Converters

## [base64Encoding](:#base64encoding)

Applies Base64 encoding of supplied data.

### Parameters

-   Raw data such as a binary buffer

### Return Value

Base 64 encoded version of the input raw data.

## [base64Decoding](:#base64decoding)

Applies Base64 decoding of supplied encloded data.

### Parameters

-   Data in Base64 encoding

### Return Value

Decodes version of the Base64 encoded input data.

## [longDay](:#longDay)

Provides the long form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the day of week in the language of the given locale code.

## [longMonth](:#longMonth)

Provides the long form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the month of year in the language of the given locale code.

## [shortDay](:#shortDay)

Provides the short form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the day of week in the language of the given locale code.

## [shortMonth](:#shortMonth)

Provides the short form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the month of year in the language of the given locale code.

# DOM - Document Object Model

## ace - append child element

Appends the childElement to the given parentElement.

### Parameters

-   parentElement - DOM Node
-   childElement - DOM Node

### Return Value

None.

## ael - add event listener

Appends a function as listener for an event off a selected element on a parent element

### Parameters

-   type - string - event name
-   selector - string - target element name
-   callback - event handling function
-   options - addiitonal options for the listener
-   parent - optional document element

### Return Value

None.

## cde - create DOM element

Creates a DOM element and assigns the list of attribute values.

### Parameters

-   type - string - DOM element type
-   options - optional - object containing a dictionary of attributes and values
-   parent - optional - DOM/SVG element parent (default DOM Document)

### Return Value

The newly created DOM element

## cse - create SVG element

Creates a SVG element and assigns the list of attribute values.

### Parameters

-   type - string - SVG element type
-   options - optional - object containing a dictionary of attributes and values
-   parent - optional - DOM/SVG element parent (default DOM Document)

### Return Value

The newly created SVG element

## qs - query selector

Locates the first DOM element that matches the CSS selector.

### Parameters

-   selector - string containing the CSS selector.
-   parent - optional - DOM element containing the target element, defaulted to DOM Document.

### Return Value

Either null or the matching DOM element.

## qsa - query selector all

Locates all DOM elements that matche the CSS selector.

### Parameters

-   selector - string containing the CSS selector.
-   parent - optional - DOM element containing the target element, defaulted to DOM Document.

### Return Value

An array of zero or more DOM elements.

# Exercising

## [adhocArray](:#adhocArray)

A function for generating an array on demand and for a specific purpose, largely for testing but could have other applications.

#### Example One - Default
```javascript
console.table(Utility.adhocArray(5));
```

| index     |  0  |  1  |  2  |  3  |  4  |
| :-------: | :-: | :-: | :-: | :-: | :-: |
| **value** |  0  |  1  |  2  |  3  |  4  |

#### Example Two - Transform
```javascript
const customTransform = i => (i + 1) * 2;
console.table(Utility.adhocArray(5, customTransform));
```

| index     |  0  |  1  |  2  |  3  |  4  |
| :-------: | :-: | :-: | :-: | :-: | :-: |
| **value** |  2  |  4  |  6  |  8  | 10  |

#### Example Three - Filter
```javascript
console.table(Utility.adhocArray(25)
  .filter(i => `${i}`.includes('2')));
```

| index     |  0  |  1  |  2  |  3  |  4  |  5  |  6  |
| :-------: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **value** |  2  | 12  | 20  | 21  | 22  | 23  | 24  |

#### Example Four - Reduce
```javascript
const customTransform = i => (i + 1) * 2;
console.log('Sum:', Utility.adhocArray(6, customTransform)
  .reduce((total, value) => total + value, 0);
```
Sum: 42

### Parameters

-   length - [number >= 0], size of the array to generate
-   transform - (optional) function for convering the incremental values in the array to something more meaningful to the test scenario.

### Return Value

An array of (length) elements. Using the defult transform the array will contain a list of numbers from zero to length - 1, incrementing by one each time. Given a valid transform function this will convert the default array to whatever is required.

The primary use case for this function is to provide a known input (array) for a map, filter or reduce (etc.) method to exercise the associated transform, predicate or reducer functions.

### Exceptions

* _adhocArray parameter 1 needs to be of type Number._
* _adhocArray parameter 1 needs to be greater than zero._
* _adhocArray parameter 2 needs to be of type Function._
* _adhocArray parameter 2 needs a single parameter._

## [consoleGroup](:#consoleGroup)

An alternative to the console.group and console.log functions but generates HTML.

### Parameters

#### Initial call

-   groupName - string - the name of the group of log messages.

#### Subsequent calls

-   logMessage - string - to be logged or null to close the group.

### Return Value

An HTML fragment ready for insertion into the Document.

## [consoleTable](:#consoleTable)

An alternative to the console.table function but generates HTML.

### Parameters

-   arr - an array of values, objects or array's of primitives.
-   domNode - (optional) target, defaulted to the document.body.

### Return Value

An HTML table ready for insertion into the Document.

## [exercise](:#exercise)

A simple mechanism for ad-hoc testing of a pure function.

### Parameters

-   expected - The value anticipated to be the result.
-   actual - The value calculated as the result.
-   id - Reference for the specific exercise. (optional)

### Return Value

Result of the comparison (true or false.)

# Ranges

## [clampRange](:#clampRange)

Function that restricts a value to within a given numeric range. Initialised with the lower and upper boundaries of a range, this function returns another specialised function.

When the specialised function is called with a single number, the value may be changed to bring it within the predefined range.

If the input value is below the lower boundary the output from the function will be the lower boundary. Likewise, if the input value exceeds the upper boundary the output from the function will be the upper boundary.

If the input value is within the boundaries the output from the function will be the input value.

### Parameters

#### Initial call

-   min - lower boundary of the range.
-   max - upper boundary of the range.

#### Subsequent calls

-   value - datum to be clamped.

### Return Value

A value within the clamped range.

## [inRange](:#inRange)

This function supports two use cases:

1. Confirm two ranges overlap.
2. Confirm a value lies within a primary range.

### Parameters

#### Initial call

-   from - lower boundry of the primary range.
-   to - upper boundry of the primary range.

#### Subsequent calls

-   from - lower boundry of the secondary range.
-   to - upper boundry of the secondary range (optional).

### Return Value

Boolean value indicating the ranges overlap or a value is within a given range.

## [liniarInterpolate](:#liniarInterpolate)

This function converts a normalised value (between 0 and 1), initilised with a given range, and returns a value within the range proportional to the input value.

### Parameters

#### Initial call

-   start - lower boundry of the range.
-   end - upper boundry of the range.

#### Subsequent calls

-   value - datum (between 0 and 1) to be interpolated.

### Return Value

A value between the _start_ and _end_ values, proportional to the input value.

## [loopRange](:#loopRange)

Calculates a new value in a sequence based on the current (_cur_) input. The value increases or decreases based on the direction (_dir_) value (1 to increase, -1 to decrease.) The value changes within a defined range up to a maximum (_max_) and minimum (_min_), which is an optional input with a default of zero.

When the value exceeds the bounds of the range it loops round to the opposite end of the range.

```
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

#### Initial call

-   max - maximum output value of the range.
-   min - minimal output value of the range (optional, defaulted to zero).

#### Subsequent calls

-   cur - Current value within the range.
-   dir - Direction of change (1 to increase and -1 to decrease.)

### Return Value

Calculated new value within the range.

## [mapRanges](:#mapRanges)

The Map Ranges function is quite self explanatory. Initialised with a source and target range, and given an input value (within the source range), it returns a value in the target range with the same normalised proportion.

### Parameters

#### Initial call

-   fromMin - lower boundry of the source range.
-   fromMax - upper boundry of the source range.
-   toMin - lower boundry of the target range.
-   toMax - upper boundry of the target range.

#### Subsequent calls

-   value - datum from the source range to be mapped into the target range.

### Return Value

When the input value is from the source range, a value in the target range is returned, otherwise unknown.

## [normaliseRange](:#normaliseRange)

The _normaliseRange_ function takes in the _min_ and _max_ values of a range within which future values are to be normalised, and returns a specialised function.

When the specialised function is called with a value within the range the result is a value proportional to the range (between 0 and 1.)

Input values outside the expected range will be either less than 0 or greater than 1, but still proportional.

### Parameters

#### Initial call

-   start - lower boundry of the range.
-   end - upper boundry of the range.

#### Subsequent calls

-   value - datum to be normalised (set to a value between 0 and 1 proportional to the given range.)

### Return Value

A value between 0 and 1.

## [rangeBetween](:#rangeBetween)

_RangeBetween_ is a generator function that produces an array of numbers between _min_ and _max (- 1)_ in _step_ intervals (default value is 1.)

```
Utilities.rangeBetween(10); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Utilities.rangeBetween(20, 10); // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

Utilities.rangeBetween(20, 10, 3); // [10, 13, 16, 19]
```

### Parameters

-   max - one more than the upper boundry of the range.
-   min - lower boundry of the range (defaulted to 0.)
-   step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing the numbers between _min_ and _max - 1_, in _step_ intervals.

## [rangeFrom](:#rangeFrom)

Similar to the _RangeBetween_ function, this function generates an array of _len_ numbers commencing with _init_ and varying by _step_. The _step_ parameter can be a fixed value (defaulted to 1) or a function using the index (starting from zero) as its input.

```
Utilities.rangeFrom(10, 10); // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

Utilities.rangeFrom(10, 10, 2); // [10, 12, 14, 16, 18, 20, 22, 24, 26, 28]

const fn = x => 2 ** x;
Utilities.rangeFrom(10, 10, x); // [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
```

### Parameters

-   init - initial value of the range.
-   len - number of values in the outputrange.
-   step - size of the interval between values in the range (defaulted to 1.)

### Return Value

A new array containing _len_ numbers starting from _init_, in _step_ intervals.

# Tools

## [compose](:#compose)

Combines a list of monadic (single parameter) functions into a single new function that expects a single input parameter.

### Parameters

-   args - a number of monadic (single parameter) functions.

### Return Value

A new monadic function that is a combination of all those provided.

## [copyText](:#copyText)

Copies the given text string to the browser's clipboard.

### Parameters

-   string - text to be copied to the clipboard.

### Return Value

None.

## [curry](:#curry)

Converts the given variadic function into one that expects arguments to be supplied one at a time.

### Parameters

-   fn - variadic function to convert into a curried function.
-   \_args - private array of arguments accumulated prior to execution.

### Return Value

A curried function.

## [enumerate](:#enumerate)

Extracts keys from the source to construct an object of enumerated values. The value of each enumeration can be the same as the original key or a number increamenting from 0.
Options enable the enumeration keys to be converted to GLOBAL_CASE, or configure the values as numeric.

### Use Cases

1. Create an object from an array of strings to be used as an Enumeration set.
2. Create a lookup object of constants (strings) that map to properties of a function map object.

### Parameters

*   source - an array or object to be used to extract the enumeration labels and values.
*   options - an optional structure used to instruct the function of its behaviour.
    -   constantProperties - Boolean flag; true to convert, false (default) to leave as is.
    -   numericValues - Boolean flag: true to provide incremental numeric values, false (default) to use the original keys.

### Return Value

An object containing the enumerated values.

### Exceptions

| Code |Description |
| :--: | :---------: |
| E-IS |_The source argument supplied is not an Array or an Object._|
| E-NP |_The source argument supplied is not populated._|
| E-NS |_The source argument supplied is not populated with string keys._|
| E-NR |_The option 'option' is not a recognised option._|
| E-NB |_The option 'option' is not a Boolean value._|

## [lens](:#lens)

Creates a repeatable function for extracting values out of objects/arrays at a given location (property/subscript).

### Parameters

-   props - one or more propertyNames or array subscripts, either individually or in strings.

### Return Value

A lookup function to return the value of a property at the stated location, for a given object.

## [memoise](:#memoise)

Converts the given pure function into on that is optimised using memoisation (caching.)

### Parameters

-   fn - pure function to convert into a memoised function.
-   \_cache - private cache of function executions.

### Return Value

A memoised function.

## [pasteText](:pasteText)

Copies text from the clipboard and returns it. This is an asynchronous operation.

### Parameters

None.

### Return Value

The text from the clipboard.

## [sleep](:sleep)

Delays processing of the current thread or a set period of time (approximately.)

### Parameters

-   ms - delay in milliseconds (1/1000th of a second)

### Return Value

None

---

# Change Log

### Update 17th March 2023

-   DOM manipulation functions added.
-   Clipboard functions copy and paste added.
-   Exercise function `consoleGroup` added. 

### Update 7th March 2023

-   Added `isEmptyObject` function to Data Comparison group.
-   Added Ancillary functions `random` and `webStore`.

### Update 1st March 2023

-   Added the `mapGetter` function to the Ancillaries group.

### Update 4th January 2023

-   Added the `adhocArray` function to the Exercising group.

### Update 11th December 2022

-   Added the absentee `sum` function.

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
