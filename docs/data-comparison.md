# Data Comparison and Cloning

- [compareObjectByProperty](#compareobjectbyproperty)
- [dataType](#datatype)
- [duplicateObject](#duplicateobject)
- [flattenObject](#flattenobject)
- [isBase](#isbase)
- [isEmptyObject](#isemptyobject)
- [isObject](#isobject)
- [objectEquality](#objectequality)
- [referencedClone](#referencedclone)

- [Index](../README.md)

---

This module exposes a constant object `DATA_TYPES` that is a collection of enumerated values representing the data types and values supported by JS.

|  Enum   | data type |   Enum   | data type |   Enum    | data type |
| :-----: | :-------: | :------: | :-------: | :-------: | :-------: |
|  ARRAY  |   array   | FUNCTION | function  |  REGEXP   |  regexp   |
| BIGINT  |  bigint   |   MAP    |    map    |    SET    |    set    |
| BOOLEAN |  boolean  |   NULL   |   null    |  STRING   |  string   |
|  DATE   |   date    |  NUMBER  |  number   |  SYMBOL   |  symbol   |
|  ERROR  |   error   |  OBJECT  |  object   | UNDEFINED | undefined |

## [compareObjectByProperty](:#compareObjectByProperty)

Creates a comparator function for use with an array of objects containing the given property.

### Parameters

- propertyName: string - name of the property to be used to compare objects in a sort method.
- ascending: boolean - optional (defaulted to true) indication or the required sort order.

### Return Value

A comparator function used to sort objects containing the given property.

## [dataType](:#datatype)

Identifies which of the above Standard data Type being used by the supplied argument.

### Parameters

- Subject variable of any type.

### Return Value

Lowercase string representation of the type of data held in the variable. This includes the following:

|  Standard Values   |        |        |
| :----------------: | :----: | :----: |
|     undefined      |  null  |        |
|                    |        |        |
| **Standard Types** |        |        |
|      boolean       | number | string |
|       object       | array  | regexp |
|        date        | error  |  set   |
|        map         | symbol | bigint |

## [duplicateObject](:#duplicateobject)

Creates a renew object with the same structure of the input, containing copies of the primitive values and objects such as RegExp, Date and Function.

### Parameters

- obj: source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values and more complicated objects.

## [flattenObject](:#flattenobject)

Reduces the complexity of the given object by renaming sub-object properties and array elements.

### Parameters

- srcObj: The source Object to be flattened. It has a default value of an empty Object.
- propKey: An optional string fro the name of a property in the source Object or lower.

### Return Value

An Object with all the properties elevated to the top level. Nested properties are flattened and given a name that is a composite.

## [isBase](:#isbase)

### Parameter

- val: A variable that might or might not be null or undefined.

### Return Value

A Boolean indicationg if the supplied parameter is null/undefined.

## [isEmptyObject](:#isEmptyobject)

Evaluates an object and reports if it is a valid but empty Object.

### Parameters

- obj: An object that could be empty, populated, null or undefined.

### Return Value

Boolean flag indication if the value is an object, null or undefined.

## [isObject](:#isobject)

### Parameters

- isObject: A variable that might or might not be an Object.

### Return Value

Boolean flag indication if the value is an object or not.

## [objectEquality](:#objectequality)

Compares two objects and reports in they are equivalent (contain the same primitives.)

### Parameters

- obj1: first object in comparison
- obj2: second object in comparison

### Return Value

Boolean flag indication if the values held withint _obj1_ are the same as those in _obj2_.

---

## [referencedClone](:#referencedclone)

Creates an ultra-shallow copy of a given object with references to not only compound properties, such as nested objects and arrays, but also primitive properties. Optional parameters enable the generated to object to include or exclude specific top-level properties.

The primary use case for this function is to generate a cut-down object that is as close to the original as possible/required.

### Parameters

- src: Object to be cloned
- propList: optional list of property names (strings). Default value is an empty array
- isInclude: optional flag to indicate how the values in the propList are to be used. Default value is false

### Return Value

New object with references to all top-level properties of the source object.

---
