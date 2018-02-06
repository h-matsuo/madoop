import DataBase from './DataBase';
import Job from './Job';
import Map from './Map';
import Reduce from './Reduce';
import Language from './Language';

const db = new DataBase();
const job = new Job();
const map = new Map();
const reduce = new Reduce();

/*
map.setLanguage(Language.JavaScript);
map.setSource(`
  () => {
    console.log('Hello, world!');
  }
`);
map.setJs(
  () => {
    console.log('Hello, world!');
  }
)
*/

map.setLanguage(Language.Cpp);
map.setSource(`
  #include <iostream>
  extern "C" {
    void code()
    {
      std::cout << "Hello, world!" << std::endl;
    }
  }
`);
map.compile();

job.set(map, reduce);

const id = db.addJob(job);
