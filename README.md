# Madoop

**M**atsuo H**adoop**

BBVC (Browser-Based Voluntary Computing) based on MapReduce model with WebAssembly Technology.


## Install

```sh
$ npm install madoop@git@github.com:kusumotolab/madoop.git
```


## How to use

```ts
import * as madoop from 'madoop';

class MyInputData extends madoop.AbstractInputData {
  // write here
}

class MyMapper extends madoop.AbstractMapper {
  // write here
}

class MyReducer extends madoop.AbstractReducer {
  // write here
}

const job = new madoop.Job('sample');
const madoop = new madoop.Madoop();

job.setInputData(new MyInputData());
job.setMapper(new MyMapper());
job.setReducer(new MyReducer());
job.setCallbackWhenCompleted(result => {
  console.log(result);
});
madoop.setJob(job);
madoop.run();
```

See `sample` directory for more details.
