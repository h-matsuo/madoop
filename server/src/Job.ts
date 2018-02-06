import Map from './Map';
import Reduce from './Reduce';

class Job {

  private map: Map;
  private reduce: Reduce;

  constructor() {
    //
  }

  set(map: Map, reduce: Reduce): void {
    this.map = map;
    this.reduce = reduce;
  }

  getMap(): Map {
    return this.map;
  }

  getReduce(): Reduce {
    return this.reduce;
  }


}

export default Job;
