# Data Comparison and Cloning

* [cloneObject](#cloneobject)
* [compareObjectByProperty](#compareobjectbyproperty)
* [dataType](#datatype)
* [duplicateObject](#duplicateobject)
* [isBase](#isbase)
* [isEmptyObject](#isemptyobject)
* [isObject](#isobject)
* [objectEquality](#objectEquality)

* [Index](README.md)

---

This module exposes a constant object `DATA_TYPES` that is a collection of enumerated values representing the data types and values supported by JS.

| Enum    | data type | Enum    | data type | Enum    | data type |
| :-----: | :-------: | :-----: | :-------: | :-----: | :-------: |
|ARRAY    | array     |FUNCTION | function  |REGEXP   | regexp    |
|BIGINT   | bigint    |MAP      | map       |SET      | set       |
|BOOLEAN  | boolean   |NULL     | null      |STRING   | string    |
|DATE     | date      |NUMBER   | number    |SYMBOL   | symbol    |
|ERROR    | error     |OBJECT   | object    |UNDEFINED| undefined |

## [cloneObject](:#cloneobject)

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

## [dataType](:#datatype)

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

## [duplicateObject](:#duplicateobject)

Creates a renew object with the same structure of the input, containing copies of the primitive values and objects such as RegExp, Date and Function.

### Parameters

-   obj - source object to be duplicated

### Return Value

A new object with the same structure as the input object and copies of the primitive values and more complicated objects.

## [isBase](:#isbase)

### Parameters

### Return Value

## [isEmptyObject](:#isEmptyobject)

Compares two objects and reports in they are equivalent (contain the same primitives.)

### Parameters

-   obj - An object that could be empty, populated, null or undefined.

### Return Value

Boolean flag indication if the value is an object, null or undefined.

## [isObject](:#isobject)

### Parameters

### Return Value

## [objectEquality](:#objectequality)

Compares two objects and reports in they are equivalent (contain the same primitives.)

### Parameters

-   obj1 - first object in comparison
-   obj2 - second object in comparison

### Return Value

Boolean flag indication if the values held withint _obj1_ are the same as those in _obj2_.

--- 
