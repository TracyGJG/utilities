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

export function isEmptyObject(obj) {
	return (
		obj && !Object.getOwnPropertyNames(obj).length && obj.constructor === Object
	);
}

export function objectEquality(obj1, obj2) {
	return deepEquality(obj1, obj2);

	function deepEquality(object1, object2) {
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			const val1 = object1[key];
			const val2 = object2[key];
			const areObjects = isObject(val1) && isObject(val2);
			if (
				(areObjects && !deepEquality(val1, val2)) ||
				(!areObjects && val1 !== val2)
			) {
				return false;
			}
		}
		return true;
	}

	function isObject(object) {
		return object != null && typeof object === 'object';
	}
}
