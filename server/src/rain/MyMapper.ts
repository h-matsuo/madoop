import AbstractMapper from './AbstractMapper';

export default
class MyMapper extends AbstractMapper {

  map(inputData: string[],
      emitFunc: (key: string, value: number) => void): void {

    inputData.forEach(line => {
      const split = line.split(',');
      const cityName = split[0];
      const rain = parseFloat(split[2]);
      emitFunc(cityName, rain);
    })

  }

}
