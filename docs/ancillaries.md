# Ancillaries

- [accumulatedAverage](#accumulatedaverage)
- [dateBasedRandom](#dateBasedRandom)
- [mapGetter](#mapGetter)
- [modulo](#modulo)
- [random](#random)
- [roundBoundry](#roundBoundry)
- [sum](#sum)

- [Index](../README.md)

---

## [accumulatedAverage](:#accumulatedaverage)

Utility for recalculating an average as the sample size increased. There are two ways of using the function, one-off and incremental, but both employ partial application.

One-off, involves calling _acculmulateAverage_ with the current average and the size of the sample (number of values from which the average is calculated.) This provides the partial application (specialised function) that can then be called with the value to be included in the average.

`Utility.accumulatedAverage(currentAverage, sampleSize)(newValue)`

The incremental appraoch of using the function involves placing the initial call without parameters (or with the defaults), to get the specialised function.

`const accumulateAverage = Utility.accumulatedAverage();`

`const newAverage = accumulateAverage(newSample)); // newAverage = (0 + newSample) / (0 + 1)`

Subsequent calls to _accumulateAverage_ with include additional values as part of the new average.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- averageToDate: Current average before the new Value arrived. (defaulted to 0)
- sampleSize: Number of values in the sample, including the new Value. (defaulted to 0)

#### Subsequent calls

- newValue: New data point to be included in the average calculation.
- newAverge: Replacement value of the averageToDate. (optional)
- newSampleSize: Replacement value of the sampleSize. (optional)

### Return Value

The new calculated average.

## [dateBasedRandom](:#dateBasedRandom)

Generates a random number based on the current Date-Time in milliseconds.

### Parameters

None.

### Return Value

A floating-point number greater than or equal to 0 and less than 1.

## [mapGetter](:#mapGetter)

Utility for creating and retrieving entities from a map object.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

- mapInstance: The map instance potentially containing an entity.
- entityFactory: Function for creating a new entity when not found in the map.

#### Subsequent calls

- entityId: The Id of the entity to be retrieved from the map or created.
- entityParams: An object containing additional paraeters required to create an entity. (optional)

### Return Value

The entity retrieved from the map or created anew.

## [modulo](:#modulo)

Calculates the modulo of a value with correct handling of negative values.

For example, winding back a (12hr) clock four hours from 2pm is not -2pm but 10am.

`modulo(12)(-4) = 10`.

### Parameters

This function employs 2-stage execution through currying.

#### Initial call

The first call expect the first argument, which is the modulus (divisor). The second parameter is optional.

#### Subsequent calls

In the secondary call the function is expecting the argument to be the second parameter, which is the dividend.

### Return Value

The modulus of the second argument by the first argument.

## [random](:#random)

Generates a number within the given range and to the stipulated precision.

### Parameters

- max: Highest value of the random range
- min: Lowest value of the random range (default 0)
- precision: Number of decimal digits allowed in the random value as a power of 10 (default 0 = 10^0)

### Return Value

A function that generates a random value within the `min` and `max` range with a given decimal precision.

## [roundBoundry](:#roundBoundry)

Facilitates rounding values to a stipluated boundry according to a stipulated rounding function.

### Parameters

- interval: The boundry to which values are rounded.
- rounderFn: The method to use for rounding (optional, defaulted to 'round', alternatives include 'floor' for round-down and 'ceil' for round-up).

### Return Value

A function that returns a value rounded in accordance with the supplied rounder function.

## [sum](:#sum)

Calculates the sum of all arguments supplied.

### Parameters

- ...nums: a (rest) array of numbers.

### Return Value

The sum of all the provided values.

### Exceptions

| Code |          Description          |
| :--: | :---------------------------: |
| E-NN | _Non-numeric value supplied._ |

---
