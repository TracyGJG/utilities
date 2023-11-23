# Archived Change Log

## Update 11th December 2022

-   Added the absentee `sum` function.

## Update 1st October 2022

-   Enhance the `enumerate` function to support capitalisation of snake and sentence|title case keys.

## Update 29th August 2022

-   Added Array `groupBy` function.

## Update 20th August 2022

-   Added `enumerate` to generate an object to support Enumeration in JS.
-   Removed `caseConverter` as it is of very little utility.

## Update 22nd April 2022

-   Added `compose` to combine a list of monadic (single parameter) functions into a single new function.

## Update 24th January 2022

-   Added `duplicateObject` to create an in-depth copy of an object including properties of data types not supported by JSON.

## Update 13th October 2021

-   Added `extractProperty` to extract objects/values from a containing object given a path of property names.
-   Refinement of the `compareObjectByProperty` method.

## Update: 21st September 2021

-   Added `compareObjectByProperty` to generate an object comparator function based on a given property name.

## Update: 22nd August 2021

-   Added `cloneObject` to enable deep duplication of objects including data types not supported by JSON.

## Update: 19th August 2021

-   Added `transposeArray` to pivot the rows with columns of a 2D array.

## Update: 11th August 2021

-   Added `reconcileArray` to update an array based on a second without losing reference.

## Update: 7th July 2021

-   Added `memoise` and `curry` functions.

## Update: 5th June 2021

-   Added `sleep` function.

## Update: 17th April 2021

-   Revised `unionArrays` function.

## Update: 3rd April 2021

-   Applied patch to address the report by Snyk of a vulnerability in the y18n package version 4.0.0.

## Update: 5th March 2021

-   New function `replaceArray` added to replace the content of an array in place, without reassignment.

## Update: 29th December 2020

-   New function `dataType` added to report the type of data held in a variable as a string.

## Update: 5th September 2020

-   This library was originally developed as an ES Module but had to be converted to Common.JS to make it compatible and testable with Jest.
Following the advice given in [Valentino Gagliardi's article](https://www.valentinog.com/blog/jest/), I have been able to to convert it back to an ES Module; making it usable by Node and in the web browser.

---

* [Current Change Log](changelog.md)

* [Index](README.md)
