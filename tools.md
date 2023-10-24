# Tools

* [compose](#compose)
* [copyText](#copytext)
* [curry](#curry)
* [enumerate](#enumerate)
* [escapeRegExp](#escaperegexp)
* [generateEnums](#generateenums)
* [isRegExpPattern](#isregexppattern)
* [lens](#lens)
* [memoise](#memoise)
* [parseJson](#parseJson)
* [pasteText](#pasteText)
* [regExpString](#regexpstring)
* [regExpTemplate](#regexptemplate)
* [simd](#simd)
* [sleep](#sleep)
* [stringifyJson](#stringifyJson)

* [Index](README.md)

---

## [compose](:#compose)

Combines a list of monadic (single parameter) functions into a single new function that expects a single input parameter.

### Parameters

-   args - a number of monadic (single parameter) functions.

### Return Value

A new monadic function that is a combination of all those provided.

## [copyText](:#copytext)

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
| E-NS |_The source argument supplied is not populated with string keys._|
| E-NR |_The option 'option' is not a recognised option._|
| E-NB |_The option 'option' is not a Boolean value._|


## [escapeRegExp](:#escaperegexp)

Converts a Regular Expression pattern to a escaped string.

### Parameters

- pattern - a string (defaulted to empty) to be escaped.

### Return Value

A string containing the escaped Regular Expression pattern.


## [generateEnums](:#generateenums)

Creates an object containing a collection of Enumerated values taken from a JSON stringified object.

### Usage

```javascript
const {shortDays, shortMonths, longDays, longMonths} = generateEnums(`{
  "shortDays": { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6},
  "longDays": { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6}
}`);
```
### Parameters

-   enumJson - a JSON stringified object containing arrays and/or objects to be used to extract the enumeration labels and values.
*   options - an optional structure used to instruct the function of its behaviour.
    -   constantProperties - Boolean flag; true to convert, false (default) to leave as is.
    -   numericValues - Boolean flag: true to provide incremental numeric values, false (default) to use the original keys.

### Return Value

An object is returned containing a collection of enumerated data values for destructuring.


## [isRegExpPattern](:#isregexppattern)

Tests to confirm the given string is a valid Regular Expression pattern.

### Parameters

- pattern - a string (defaulted to empty) to be escaped.

### Return Value

A Boolean value indicating the given string was either a normal populated string or a valid Regular Expression pattern.


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

## [parseJson](:#parseJson)

Safer implementation of the JSON.parse method that return an error when an exception is encountered. 

### Parameters

-   jsonString (JS String) subject of the String to Object convertion.
-   reviver (function) used to intercept the convertion process.

### Return Value

An object is returned containing either a data property when successful, or an error property to report the cause of an exception.

## [pasteText](:#pastetext)

Copies text from the clipboard and returns it. This is an asynchronous operation.

### Parameters

None.

### Return Value

The text from the clipboard.

## [simd](:#simd)

Single-Instruction-Multiple-Data - Generates a function based on the intial input that well be applied to all data subsequently supplied. The function is called from within a Promise to all data is processes in parallel.

### Paremeters

This function employs 2-stage execution through currying.

#### Initial call

-   instruction - the function to be applied to each datum. Returns a reusable function.

#### Subsequent calls

-   data - One or more datum.

### Return Value

An array of return values for each datum passed through the instruction (function).


## [regExpString](:#regexpstring)

A Tagged Template to convert a regular string into an escaped Regular Expression pattern.

### Parameters

- An template literal containing a Regular Expression pattern with RegExp escaped characters.

### Return Value

A string with all the Regular Expression characters escaped.


## [regExpTemplate](:#regexptemplate)

Enables the production of Regular Expression objects using more easily readable patterns based on template literals. This function is based on Douglas Crockford's mega_regexp function but extended to utilise String.raw method to remove the need to escape special charcaters.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

-  regExpFlags - the optional string containing any flags to be applied when creating the RegExp object.

#### Subsequent calls

-  templateTextSections - array of text sections of the Template Literal, destructed to expose the `raw` property.
-  templateValueSecions - (rest) array of values interpolated in the Template Literal.

### Return Value

A new RegExp object based on the supplied arguments.


## [sleep](:#sleep)

Delays processing of the current thread or a set period of time (approximately.)

### Parameters

-   ms - delay in milliseconds (1/1000th of a second)

### Return Value

None

## [stringifyJson](:#stringifyJson)

Safer implementation of the JSON.stringify method that return an error when an exception is encountered. 

### Parameters

-   jsonObject (JS Object) subject of the Object to String convertion.
-   replacer (function) used to intercept the convertion process.
-   spaces (number) of spaces used to indent scopes of the Object. 

### Return Value

An object is returned containing either a data property when successful, or an error property to report the cause of an exception.

---