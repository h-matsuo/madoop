export default
abstract class AbstractReducer {

  abstract reduce(
    inputData: Map<any, any[]>,
    emitFunc: (key: any, value: any) => void
  ): void;

}
