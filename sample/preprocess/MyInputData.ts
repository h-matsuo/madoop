import {AbstractInputData} from '../../';

export default
class MyInputData extends AbstractInputData {

  constructor() {
    super();
    this.addInputData('https://raw.githubusercontent.com/h-matsuo/madoop/master/README.md');
    this.addInputData('https://raw.githubusercontent.com/h-matsuo/madoop/master/LICENSE');
  }

}
