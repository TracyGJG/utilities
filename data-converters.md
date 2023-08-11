# Data Converters

* [base64decoding](#base64decoding)
* [base64encoding](#base64encoding)
* [longDay](#longday)
* [longMonth](#longmonth)
* [shortDay](#shortday)
* [shortMonth](#shortmonth)

* [Index](README.md)

---

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

## [longDay](:#longday)

Provides the long form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the day of week in the language of the given locale code.

## [longMonth](:#longmonth)

Provides the long form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the long form of the month of year in the language of the given locale code.

## [shortDay](:#shortday)

Provides the short form of the day of week in the given locale, based in a numeric value in the range of 0 to 6.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-6 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the day of week in the language of the given locale code.

## [shortMonth](:#shortmonth)

Provides the short form of the month of year in the given locale, based in a numeric value in the range of 0 to 11.

### Parameters

-   lang - Locale string (defaulted to gb-GB)
-   idx - Number in the range of 0-11 (optional on initial call, mandatory on second call.)

### Return Value

String representing the short form of the month of year in the language of the given locale code.

---
