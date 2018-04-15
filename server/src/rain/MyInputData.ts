import * as fs from 'fs';

import InputData from '../lib/InputData';

export default
class MyInputData extends InputData {

  constructor() {
    super();
    const rawData = fs.readFileSync('../../../data/data-all.csv', 'utf8');
    const data = rawData.split('\n');
    data.shift(); // Remove first line
    this.addInputData(data);
  }

}
