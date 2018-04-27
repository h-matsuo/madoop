import AbstractReducer from '../lib/AbstractReducer';

export default
class MyReducer extends AbstractReducer {

  reduce(
    inputData: Map<any, any[]>,
    emitFunc: (key: string, value: number) => void
  ): void {

    inputData.forEach((values, key) => {
      let sum = 0;
      values.forEach(value => { sum += value; });
      emitFunc(key, sum);
    });

  }

}
