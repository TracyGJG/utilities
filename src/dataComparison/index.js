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

export function cloneObject(obj) {
	if (obj === null || typeof obj !== 'object' || '__isActiveClone' in obj)
		return obj;

	let temp = obj instanceof Date ? new obj.constructor() : obj.constructor();

	for (let key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['__isActiveClone'] = null;
			temp[key] = cloneObject(obj[key]);
			delete obj['__isActiveClone'];
		}
	}
	return temp;
}

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

export function duplicateObject(srcObj) {
	if (Array.isArray(srcObj)) {
		return srcObj.map(duplicateObject);
	}
	if (srcObj != null && typeof srcObj === 'object') {
		if (srcObj instanceof Date) {
			return new Date(srcObj.toISOString());
		}
		if (srcObj instanceof RegExp) {
			return new RegExp(srcObj.source, srcObj.flags);
		}
		return Object.entries(srcObj).reduce(
			(tgtObj, [propName, propValue]) => ({
				...tgtObj,
				[propName]: duplicateObject(propValue),
			}),
			{}
		);
	} else {
		return srcObj;
	}
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
			console.log(`Primitive: ${propName} = ${propValue}`);
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
	const keysString = obj => Object.keys(obj).join();
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
