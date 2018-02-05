import Language from './Language';

class Map {

  private language: Language;
  private source: string;

  getLanguage(): Language {
    return this.language;
  }

  getSource(): string {
    return this.source;
  }

}

export default Map;
