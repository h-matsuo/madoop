export default
abstract class AbstractMapper {

  abstract map(
    inputData: any,
    emitFunc: (key: any, value: any) => void
  ): void;

}
