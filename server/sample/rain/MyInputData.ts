import * as fs from 'fs';

import AbstractInputData from '../../madoop/AbstractInputData';

export default
class MyInputData extends AbstractInputData {

  constructor() {
    super();
    const rawData = fs.readFileSync('./data/data-all.csv', 'utf8');
    const data = rawData.split('\n');
    data.shift(); // Remove first line
    const length = data.length;
    const step = 100;
    for (let i = 0; i < Math.floor(length / step); ++i) {
      const begin = step * i;
      const end = step * (i + 1);
      this.addInputData(data.slice(begin, end));
    }
    this.addInputData(data.slice(step * Math.floor(length / step)));
  }

}
