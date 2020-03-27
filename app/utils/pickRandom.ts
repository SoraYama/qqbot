import _ from 'lodash';

export interface RandomItem {
  weight: number;
}

const pickRandom = <T extends RandomItem>(list: T[]) => {
  if (_.isEmpty(list)) {
    return null;
  }
  if (_(list).some((item) => item.weight === undefined)) {
    throw new Error('Missing weight key in item of list');
  }
  const len = list.length;
  const total = _(list)
    .map((item) => item.weight)
    .reduce((a, b) => a + b, 0);
  const randomIndex = _.random(total);
  const sorted = _(list)
    .sortBy('weight')
    .value();
  const sortedWeight = _(sorted)
    .map((item) => item.weight)
    .value();
  let curTotal = 0;
  for (let i = 0; i < len; i++) {
    curTotal += sortedWeight[i];
    if (randomIndex <= curTotal) {
      return sorted[i];
    }
  }
  return sorted[0];
};

export default pickRandom;
