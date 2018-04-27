import AbstractMapper from '../../madoop/AbstractMapper';

export default
class MyMapper extends AbstractMapper {

  map(
    inputData: string[],
    emitFunc: (key: string, value: number) => void
  ): void {

    inputData.forEach(line => {
      if (line === '') { return; }
      const split = line.split(',');
      const cityName = split[0];
      const rain = parseFloat(split[2]);
      if (Number.isNaN(rain)) { return; }
      emitFunc(cityName, rain);
    })

  }

}
