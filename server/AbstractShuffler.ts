import MapperResult from "./MapperResult";

export default
abstract class AbstractShuffler {

  abstract setUpReducerInputData(
    mapperResult: MapperResult | Map<any, any[]>
  ): Map<any, any[]>[];

}
