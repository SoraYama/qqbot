import yargs from 'yargs';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

import pickRandom from '../app/utils/pickRandom';
import groupConfig from '../app/modules/kancolle/mini/assets/group';
import shipsConfig from '../app/modules/kancolle/mini/assets/ships';

const argv = yargs.options({
  input: { type: 'array', default: [1500, 1500, 2000, 1000] },
  times: { type: 'number', default: 50 },
  seceretary: { type: 'number', default: null },
}).argv;

const inputResource = argv.input;
const BUILD_RESOURCE_MAX = 7000;
const KOUBU_FIG = 7.5;

function computeExtraWeight(requiredResource: number[], inputResource: number[]) {
  let extraWeight = 0;
  for (let i = 0; i < 4; i++) {
    extraWeight +=
      Math.round((BUILD_RESOURCE_MAX - (inputResource[i] - requiredResource[i])) / 1000) *
      (i === 3 ? 1 : KOUBU_FIG);
  }
  return extraWeight;
}

function build() {
  const group = pickRandom(groupConfig);
  const filteredByGroup = _(shipsConfig).filter((ship) => group.ships.includes(ship.id));
  const filteredByResource = filteredByGroup.filter((item) =>
    _.every(item.resource, (r, i) => r <= inputResource[i]),
  );
  const filteredBySeceretary = filteredByResource.filter(
    (item) => item.seceretary === null || _.indexOf(item.seceretary, argv.seceretary) > -1,
  );
  const weightMapped = filteredBySeceretary
    .map((item) => {
      return {
        ...item,
        weight: item.weight + computeExtraWeight(item.resource, inputResource),
      };
    })
    .value();

  const selectedShip = pickRandom(weightMapped);
  const outPut = `${selectedShip.name},[${inputResource.join(' ')}]\n`;
  fs.appendFile(path.resolve(__dirname, '..', 'report', 'build.csv'), outPut, {
    encoding: 'utf-8',
  });
}

for (let i = 0; i < argv.times; i++) {
  build();
}
