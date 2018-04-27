export default
abstract class AbstractMapper {

  // execMap(): void {
    // map()
  // }

  abstract map(
    inputData: any,
    emitFunc: (key: any, value: any) => void
  ): void;

}
