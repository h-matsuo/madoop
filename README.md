# Madoop

**M**atsuo H**adoop**

BBVC (Browser-Based Voluntary Computing) based on MapReduce model with WebAssembly Technology.


## Install

```sh
$ npm install git+ssh://git@github.com/h-matsuo/madoop.git
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
const m = new madoop.Madoop();

job.setInputData(new MyInputData());
job.setMapper(new MyMapper());
job.setReducer(new MyReducer());
job.setCallbackWhenCompleted(result => {
  console.log(result);
});
m.setJob(job);
m.run();
```

See `sample` directory for more details.
