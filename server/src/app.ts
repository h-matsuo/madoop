import DataBase from './DataBase';
import Job from './Job';
import Map from './Map';
import Reduce from './Reduce';
import Language from './Language';

const db = new DataBase();
let job = new Job();
let map = new Map();
let reduce = new Reduce();

let source = `
/*
* Madoop implementation example: word count: map function
*/
function map( data /* :string   */ ,
              emit /* :function */ ) {
  // Initialize result
  let result = {};
  // Count the number of occurrences of each word
  data.split(/\\s/).forEach(element => {
    if (!result.hasOwnProperty(element)) {
      result[element] = 0;
    }
    result[element]++;
  });
  // Emit key-value pairs
  for (const key in result) {
    emit(key, result[key]);
  }
}
`;
map.setLanguage(Language.JavaScript);
map.setSource(source);
map.setJs(new Function('data', 'emit', `
  ${source}
  map(data, emit);
`));


/*
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
*/

job.setMap(map);

const id = db.addJob(job);

map.getJs()('a i u e o a', (key, value) => { console.log(`${key}: ${value}`); });
