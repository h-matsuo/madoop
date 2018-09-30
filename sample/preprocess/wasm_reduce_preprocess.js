madoop.runtime.wasmReducePreprocess = async ({key: key, value: value}) => {
  return {key: 'this-key-was-overwritten', value: value};
};
