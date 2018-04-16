import InputData from '../lib/InputData';

export default
class MyInputData extends InputData {

  constructor() {
    super();
    this.addInputData('is this a pen ?');
    this.addInputData('this is a pen .');
    this.addInputData('it is a pencil .');
  }

}
