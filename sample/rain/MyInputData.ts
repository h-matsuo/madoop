import * as fs from 'fs';

import {AbstractInputData} from '../../';

export default
class MyInputData extends AbstractInputData {

  constructor() {
    super();
    const rawData = fs.readFileSync('./data/data-all.csv', 'utf8');
    const data = rawData.split('\n');
    data.shift(); // Remove first line
    const length = data.length;
    const step = 10000;
    const dataElement: string[][] = [];
    for (let i = 0; i < Math.floor(length / step); ++i) {
      const begin = step * i;
      const end = step * (i + 1);
      dataElement.push(data.slice(begin, end));
    }
    dataElement.push(data.slice(step * Math.floor(length / step)));
    for (let i = 0; i < dataElement.length; ++i) {
      let line = '';
      for (let j = 0; j < dataElement[i].length; ++j) {
        line += dataElement[i][j] + '\n';
      }
      this.addInputData(line);
    }
  }

}
