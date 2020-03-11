import _ from 'lodash';

const resourceStr = ['油', '弹', '钢', '铝'];

export const showResource = (resource: number[] = []) => {
  return _(resource)
    .map((r, i) => `${resourceStr[i]}: ${r}`)
    .join(' ');
};
