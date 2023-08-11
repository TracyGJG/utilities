# Arrays

* [batchBy](#batchby)
* [groupBy](#groupby)
* [intersectArrays](#intersectarrays)
* [permute](#permute)
* [reconcileArray](#reconcilearray)
* [replaceArray](#replacearray)
* [shuffleArray](#shufflearray)
* [transposeArray](#transposearray)
* [unflatten](#unflatten)
* [unionArrays](#unionarrays)

* [Index](README.md)

---

## [batchBy](:#batchby) methods

Both methods follow the same pattern: They take a single number and return a function. The generated function takes an array and returns an array of batches (arrays).

* size - splits a given array into a number of batches of the stipulated size.
* number - splits a given array into the stipulated number of evenly distributed batches.

```javascript
const sourceArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3 ];

const batchByThree = batchBy.size(3);

const batchesOfThree = batchByThree(sourceArray);

// Five batches with as many as possible containing three items.
/* batchesOfThree = [
  [ 1, 2, 3 ],
  [ 4, 5, 6 ],
  [ 7, 8, 9 ],
  [ 0, 1, 2 ],
  [ 3 ]
]
*/

const fourBatches = batchBy.number(4)(sourceArray);

// Four evenly (as possible) distributed batches.
/* fourBatches = [
  [ 1, 2, 3, 4 ],
  [ 5, 6, 7 ],
  [ 8, 9, 0 ],
  [ 1, 2, 3 ]
]
*/
```

### Parameters

* size: The maximum content of each batch with the minimum being one less.
* number: The maximum number of batches to split the input array with;
   - The batch size to vary by no more than one item.
   - The number of batches to only be less than the given argument when it exceeds the size of the input array.

### Return Value

Arrays of batches (array) populated with content of the input array.

## [groupBy](:#groupby)

Given a source array of objects and a function used to identify to which group an object belongs, this function creates an object with a property for each group of objects.

```javascript
  const groupFunction = ({ name }) => name;
  const sourceArray = [
    { id: 1, name: 'alpha' },
    { id: 2, name: 'beta' },
    { id: 3, name: 'alpha' },
  ];
  const resultGroupFunction = groupBy(groupFunction);
  const resultGroupObject = resultGroupFunction(sourceArray);
```

The variable `resultGroupObject` with contain the following object:

```javascript
{
  alpha: [
    { id: 1, name: 'alpha' },
    { id: 3, name: 'alpha' },
  ],
  beta: [
    { id: 2, name: 'beta' },
  ]
}
```

### Parameters

-   Function that identifies the group of an object in the array
-   Source array of objects

The arguments can be supplied at the same time or one at a time. So the above example could be performed as follows:

```javascript
  const resultGroupObject = groupBy(groupFunction, sourceArray);
```

### Return Value

An object with a property for each group found. Each property has an array of objects as its value.

## [intersectArrays](:#intersectarrays)

Extracts the common values of all the input arrays into a new array of distinct values.

```javascript
Utilities.intersectArrays([1, 2, 3, 4], [3, 4, 5, 6]); // [3, 4]
```

### Parameters

-   arrays - One or more arrays from which the intersect is to be extracted.

### Return Value

A new array containing only those values found in all the given arrays.

## [permute](:#permute)

Permute creates an array of arrays containg every permutation of the values from each of the input arrays.

### Parameters

-   Series of Arrays - where each array is a dimension of the structure to be produced. 

### Return Value

An array of arrays nested to the depth equal to the number of input arrays. Each element of the structure is an array containing an element from each of the input arrays, in sequence.

## [reconcileArray](:#reconcilearray)

Replaces the content of the _targetArray_ with content from the _sourceArray_ using the _objectKey_ to locate common objects. Object in the _sourceArray_ but not in target are added, those in target but not source are removed. Objects that appear in both arrays, as identified by the _objectKey_ property, are updated with any array properties also preserved.

### Parameters

-   sourceArray - Reference to an Object Array containing content to by used to update the primary array.
-   targetArray - Reference to an Object Array to be updated without losing reference.
-   objectKey - Optional string (defaulted to 'id') name of the property of all objects in the array that act as a unique identifier.

### Return Value

None - updates the targetArray directly by reference.

## [replaceArray](:#replacearray)

Replaces the content of the _targetArray_ with the (optional) content of the _arrayContent_.

### Parameters

-   targetArray - Reference to the array to be replaced.
-   arrayContent - Optional reference to an array containing data to populate the target array.

### Return Value

None - updates the _targetArray_ directly by reference.

## [shuffleArray](:#shufflearray)

### Parameters

### Return Value

## [transposeArray](:#transposearray)

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

## [unflatten](:#unflatten)

Converts an array of single depth into a compound structure (array of arrays) according to the initial specification.

### Parameters

This function is executed to a sequence of two calls.

#### Primary call

-   List of numbers indication the size of each dimension of an array in the new structure.

#### Return Value

The first call prodcues a specialised array that uses the supplied specification.

#### Secondary call

-   A single depth array of values to be restructured.

#### Return Value

A structure populated with the data supplied in the second call and in the structure defined by the specification from the first call.

## [unionArrays](:#unionArrays)

Extracts a list of all the values from the input arrays into a new array of distinct values.

```javascript
Utilities.unionArrays([1, 2, 3, 4], [3, 4, 5, 6]); // [1, 2, 3, 4, 5 ,6]
```

### Parameters

-   arrays - One or more arrays from which the union is to be extracted.

### Return Value

A new array containing a distinct list of values from all of the given arrays.

---
