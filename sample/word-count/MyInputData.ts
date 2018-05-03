import {AbstractInputData} from '../../';

export default
class MyInputData extends AbstractInputData {

  constructor() {
    super();
    this.addInputData('is this a pen ?');
    this.addInputData('this is a pen .');
    this.addInputData('it is a pencil .');
  }

}
