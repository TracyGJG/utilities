# DOM - Document Object Model

- [acc](#acc)
- [ace](#ace)
- [ael](#ael)
- [cde](#cde)
- [cse](#cse)
- [dce](#dce)
- [qs](#qs)
- [qsa](#qsa)
- [sui](#sui)
- [debounce](#debounce)
- [throttle](#throttle)
- [poller](#poller)

- [Index](../README.md)

---

## [acc](:#acc) - add CSS Class

Add the stipulated CSS Class to the element of the given selector within the optional dom.

### Parameters

- selector: A CSS selector identifying the target for the CSS Class
- className: The CSS Class to be added
- dom: The document or DOM element containing the target (optional, default Document)

### Return Value

None.

## [ace](:#ace) - append child element

Appends the childElement to the given parentElement.

### Parameters

- parentElement: DOM Node
- childElement: DOM Node

### Return Value

None.

## [ael](:#ael) - add event listener

Appends a function as listener for an event off a selected element on a parent element

### Parameters

- type: string - event name
- selector: string - target element name
- callback: event handling function
- options: addiitonal options for the listener
- parent: optional document element

### Return Value

None.

## [cde](:#cde) - create DOM element

Creates a DOM element and assigns the list of attribute values.

### Parameters

- type: string - DOM element type
- options: optional - object containing a dictionary of attributes and values
- parent: optional - DOM/SVG element parent (default DOM Document)

### Return Value

The newly created DOM element

## [cse](:#cse) - create SVG element

Creates a SVG element and assigns the list of attribute values.

### Parameters

- type: string - SVG element type
- options: optional - object containing a dictionary of attributes and values
- parent: optional - DOM/SVG element parent (default DOM Document)

### Return Value

The newly created SVG element

## [dce](:#dce) - delete child elements

Removes all the child elements contained within a given parentElement.

### Parameters

- parentElement: The DOM element containing the child elements to be deleted.

### Return Value

None.

## [qs](:#qs) - query selector

Locates the first DOM element that matches the CSS selector.

### Parameters

- selector: string containing the CSS selector.
- parent: optional - DOM element containing the target element, defaulted to DOM Document.

### Return Value

Either null or the matching DOM element.

## [qsa](:#qsa) - query selector all

Locates all DOM elements that matche the CSS selector.

### Parameters

- selector: string containing the CSS selector.
- parent: optional - DOM element containing the target element, defaulted to DOM Document.

### Return Value

An array of zero or more DOM elements.

## [sui](:#sui) - sanitize Untrusted/User input

Uses a brand new DIV elment in the DOM to convert the untrusted text into HTML text.

### Parameters

- text: The untrusted user input text to be sanitized
- dom: The document or DOM element containing the target (optional, defaulted to the Document element)

### Return Value

The sanitized text.

## [debounce](:#debounce)

Converts the given callback function to one that is debounced for a specific period of time in ms.

### Parameters

- callback: The callback function to be debounced
- delay: The optional period before the callback is actually executed (default 1000ms).

### Return Value

The debounced callback function.

## [throttle](:#throttle)

Converts the given callback function to one that is throttled for a specific period of time in ms.

### Parameters

- callback: The callback function to be trottled
- delay: The optional period before the callback can be re-executed (default 1000ms).

### Return Value

The trottled callback function.

## [poller](:#poller)

A wrapper function used to perform checks on a regular interval to ensure the condition is right to perform an action. The polling is limited to a maximum number of cycles and if reached the action is preformed regardless of the check.

### Parameter

- interval: (number) the duration (in milliseconds) between checks - the polling interval.
- cycles: (number) the maxmimum number of checks to be performed before the action is performed regardless of the result of the check function.
- checkFn: (function) executed with each cycle is to confirm if the pre-condition has been achieved.
- actionFn: (function) executed when either the check function passes or the number of cycles is reached.

### Return Value

None.

---
