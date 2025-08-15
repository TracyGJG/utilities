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

export function permute(...axies) {
  return (function _permute(...indicies) {
    return indicies.length === axies.length
      ? indicies
      : axies[indicies.length].map((datum) => _permute(...indicies, datum));
  })();
}

export function reconcileArrays(sourceArray, targetArray, objectKey = 'id') {
  const compareProperties = (target) => (source) =>
    source[objectKey] === target[objectKey];

  replaceArray(
    targetArray,
    sourceArray.map((sourceItem) => {
      const targetItem = targetArray.find(compareProperties(sourceItem));
      return targetItem ? updateItem(sourceItem, targetItem) : sourceItem;
    })
  );

  function updateItem(source, target) {
    Object.entries(source).forEach((entry) =>
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

export function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function transposeArray(matrix) {
  return matrix.reduce(
    (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
    []
  );
}

export function unflatten(...specification) {
  return (flatData) => _unflatten(structuredClone(flatData), ...specification);

  function _unflatten(data, splits, ...specs) {
    const splitSize = Math.ceil(data.length / splits);
    const result = [];
    while (splits--) {
      result.push(data.splice(0, splitSize));
    }
    return specs.length
      ? result.map((sec) => _unflatten(sec, ...specs))
      : result;
  }
}
