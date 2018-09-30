import {AbstractShuffler} from '../../';

export default
class MyShuffler extends AbstractShuffler {

  setUpReducerInputData(
    mapperResult: Map<any, any[]>
  ): Map<any, any[]>[] {

    const reduceInputData = [];
    const data = new Map<any, any[]>();
    mapperResult.forEach((values, key) => {
      data.set(key, values);
    });
    reduceInputData.push(data);
    return reduceInputData;

  }

}
