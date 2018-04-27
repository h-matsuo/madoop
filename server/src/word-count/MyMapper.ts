import AbstractMapper from '../lib/AbstractMapper';

export default
class MyMapper extends AbstractMapper {

  map(
    inputData: string,
    emitFunc: (key: string, value: number) => void
  ): void {

    // Initialize result
    let result = {};
    // Count the number of occurrences of each word
    inputData.split(/\s/).forEach(element => {
      if (!result.hasOwnProperty(element)) {
        result[element] = 0;
      }
      result[element]++;
    });
    // Emit key-value pairs
    for (const key in result) {
      emitFunc(key, result[key]);
    }

  }

}
