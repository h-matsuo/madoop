class MadoopError implements Error {

  name: string = 'MadoopError';
  message: string;

  constructor(message?: string) {
    this.message = message;
  }

}

export default MadoopError;
