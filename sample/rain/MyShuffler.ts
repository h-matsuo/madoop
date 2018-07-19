import {AbstractShuffler} from '../../';

export default
class MyShuffler extends AbstractShuffler {

  setUpReducerInputData(
    mapperResult: Map<any, any[]>
  ): Map<any, any[]>[] {

    const reduceInputData = [];
    mapperResult.forEach((values, key) => {
      const data = new Map<any, any[]>();
      data.set(key, values);
      reduceInputData.push(data);
    });
    return reduceInputData;

  }

}
