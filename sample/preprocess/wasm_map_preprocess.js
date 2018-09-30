madoop.runtime.wasmMapPreprocess = async url => {
  const text = await fetch(url).then(res => res.text());
  return text;
};
