export const DATA_TYPES = JSON.parse(`{
	"ARRAY": "array",
	"BIGINT": "bigint",
	"BOOLEAN": "boolean",
	"DATE": "date",
	"ERROR": "error",
	"FUNCTION": "function",
	"MAP": "map",
	"NULL": "null",
	"NUMBER": "number",
	"OBJECT": "object",
	"REGEXP": "regexp",
	"SET": "set",
	"STRING": "string",
	"SYMBOL": "symbol",
	"UNDEFINED": "undefined"
}`);

export function compareObjectByProperty(propName, ascending = true) {
  return (objA, objB) =>
    (ascending ? 1 : -1) *
    (objA[propName] < objB[propName]
      ? -1
      : 1 * (objA[propName] > objB[propName]));
}

export function dataType(subject) {
  return Object.prototype.toString.call(subject).slice(8, -1).toLowerCase();
}

export function flattenObject(srcObj) {
  return Object.entries(srcObj).reduce(
    (newObj, [key, value]) => _flattenObject(newObj, key, value),
    {}
  );

  function _flattenObject(tgtObj, propName, propValue) {
    if (Array.isArray(propValue)) {
      propValue.forEach((arrValue, index) =>
        _flattenObject(tgtObj, `${propName}[${index}]`, arrValue)
      );
    } else if (isObject(propValue) && !isEmptyObject(propValue)) {
      Object.entries(propValue).forEach(([propKey, propVal]) =>
        _flattenObject(tgtObj, `${propName}.${propKey}`, propVal)
      );
    } else {
      tgtObj[`${propName}`] = propValue;
    }
    return tgtObj;
  }
}

export function isBase(val) {
  return val == null;
}

export function isEmptyObject(obj) {
  return (
    obj && !Object.getOwnPropertyNames(obj).length && obj.constructor === Object
  );
}

export function isObject(obj) {
  return obj === Object(obj) && !Array.isArray(obj);
}

export function objectEquality(obj1, obj2, testStructureOnly = false) {
  const keysString = (obj) => Object.keys(obj).join();
  const typeCompare = (val1, val2) => dataType(val1) === dataType(val2);
  return deepEquality(obj1, obj2);

  function deepEquality(val1, val2) {
    if (isObject(val1)) {
      return (
        isObject(val2) &&
        keysString(val1) === keysString(val2) &&
        Object.entries(val1).every(([key, val]) =>
          deepEquality(val, val2?.[key])
        )
      );
    }
    if (Array.isArray(val1)) {
      return (
        Array.isArray(val2) &&
        val1.length === val2.length &&
        val1.every((val, idx) => deepEquality(val, val2?.[idx]))
      );
    }
    return typeCompare(val1, val2) && (testStructureOnly || val1 === val2);
  }
}

export function reduceObject(...propertyNames) {
  if (!propertyNames.length)
    throw Error(
      'Error: reduceObject requires at least 1 property name as a parameter.'
    );

  return (srcObj) =>
    Object.entries(srcObj).reduce(
      (dstObj, [key, val]) =>
        propertyNames.includes(key) ? { ...dstObj, [key]: val } : dstObj,
      {}
    );
}

export function referencedClone(src, propList = [], isInclude = false) {
  if (!isObject(src)) return src;
  return Object.entries(src).reduce((tgt, [key, val]) => {
    if (isInclude === propList.includes(key)) {
      if (_isObject(val)) {
        tgt[key] = val;
      } else {
        Object.defineProperty(tgt, key, {
          get() {
            return src[key];
          },
          set(_val) {
            src[key] = _val;
          },
          enumerable: true,
        });
      }
    }
    return tgt;
  }, {});

  function _isObject(obj) {
    return !!obj && typeof obj === 'object';
  }
}
