# Exercising

* [adhocArray](#adhocarray)
* [consoleGroup](#consolegroup)
* [consoleTable](#consoletable)
* [exercise](#exercise)

* [Index](README.md)

---

## [adhocArray](:#adhocarray)

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

## [consoleGroup](:#consolegroup)

An alternative to the console.group and console.log functions but generates HTML.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

-   groupName - string - the name of the group of log messages.

#### Subsequent calls

-   logMessage - string - to be logged or null to close the group.

### Return Value

An HTML fragment ready for insertion into the Document.

## [consoleTable](:#consoletable)

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

---