export const batchBy = {
	size: batchBySize,
	number: batchByNumber,
};

function batchBySize(batchSize) {
	return function (sourceData) {
		const _sourceData = [...sourceData];
		const batches = [];
		let batchStart = 0;
		while (batchStart < _sourceData.length) {
			batches.push(_sourceData.slice(batchStart, (batchStart += batchSize)));
		}
		return batches;
	};
}

function batchByNumber(numberOfBatches) {
	return function (sourceData) {
		const batches = [];
		if (sourceData.length) {
			const _sourceData = [...sourceData];
			const batchSize = Math.floor(_sourceData.length / numberOfBatches);
			const batchRemainder = _sourceData.length % numberOfBatches;
			let batchStart = 0;

			for (let batchIndex = 0; batchIndex < numberOfBatches; batchIndex++) {
				batches.push(
					_sourceData.slice(
						batchStart,
						(batchStart +=
							batchSize + +(batchRemainder && batchIndex < batchRemainder))
					)
				);
			}
		}
		return batches;
	};
}

export function groupBy(lookupFn, sourceArray) {
	return sourceArray
		? sourceArray.reduce(_groupBy, {})
		: groupBy.bind(null, lookupFn);
	function _groupBy(groupObj, obj) {
		const group = lookupFn(obj);
		return {
			...groupObj,
			[group]: [...(groupObj[group] ?? []), obj],
		};
	}
}

export function intersectArrays(...arrays) {
	return arrays.reduce((arrAcc, arrN) =>
		[...new Set(arrAcc)].filter(item => arrN.includes(item))
	);
}

export function reconcileArrays(sourceArray, targetArray, objectKey = 'id') {
	const compareProperties = target => source =>
		source[objectKey] === target[objectKey];

	replaceArray(
		targetArray,
		sourceArray.map(sourceItem => {
			const targetItem = targetArray.find(compareProperties(sourceItem));
			return targetItem ? updateItem(sourceItem, targetItem) : sourceItem;
		})
	);

	function updateItem(source, target) {
		Object.entries(source).forEach(entry =>
			Array.isArray(entry[1])
				? replaceArray(target[entry[0]], entry[1])
				: (target[entry[0]] = entry[1])
		);
		return source;
	}
}

export function replaceArray(targetArray, arrayContent = []) {
	targetArray.splice(0, targetArray.length, ...arrayContent);
	return targetArray;
}

export function transposeArray(matrix) {
	return matrix.reduce(
		(_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
		[]
	);
}

export function unionArrays(...arrays) {
	return [...new Set(arrays.flat())];
}
