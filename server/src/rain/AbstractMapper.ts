export default
abstract class AbstractMapper {

  execMap(): void {

  }

  abstract map(inputData: any,
    emitFunc: (key: any, value: any) => void): void;

}
