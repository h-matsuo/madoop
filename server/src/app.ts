import DataBase from './DataBase';
import Job from './Job';
import Data from './Data';
import MapMethod from './MapMethod';
import Reduce from './Reduce';
import Language from './Language';

const db = new DataBase();
let job = new Job();
let data = new Data();
let map = new MapMethod();
let reduce = new Reduce();

let source: string = null;

///// Example of pure JavaScript ///////////////////////////////////////////////
source = `
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
////////////////////////////////////////////////////////////////////////////////

///// Example of C /////////////////////////////////////////////////////////////
source = `
/*
 * Madoop implementation example: word count: map function
 */
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>

std::vector<std::string> split(const std::string &, char);

extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit(const char*, const char*); // REQUIRED to emit key-value pairs

  void map(const char* data)
  {
    // Count the number of occurrences of each word
    const std::string &data_str = std::string(data);
    std::unordered_map<std::string, int> hashmap;
    const std::vector<std::string> &words = split(data_str, ' ');
    for (auto &element: words) {
      hashmap[element]++;
    }
    // Emit key-value pairs
    for (auto &element: hashmap) {
      const std::string &key   = element.first;
      const std::string &value = std::to_string(element.second);
      emit(key.c_str(), value.c_str());
    }
  }

}

// Split \`std::string\` with \`char\`
std::vector<std::string> split(const std::string &str, char sep)
{
  std::vector<std::string> v;
  std::stringstream ss(str);
  std::string buffer;
  while(std::getline(ss, buffer, sep)) {
    v.push_back(buffer);
  }
  return v;
}
`;
// map.setLanguage(Language.Cpp);
// map.setSource(source);
// map.compile();
////////////////////////////////////////////////////////////////////////////////

job.setMapMethod(map);

///// Example of pure JavaScript ///////////////////////////////////////////////
source = `
/*
 * Madoop implementation example: word count: reduce function
 */
function reduce( data /* :Map<key, values[]> */ ,
                 emit /* :function           */ ) {
  data.forEach((values, key) => {
    let sum = 0;
    values.forEach(value => { sum += value; });
    emit(key, sum);
  });
}
`;
reduce.setLanguage(Language.JavaScript);
reduce.setSource(source);
reduce.setJs(new Function('data', 'emit', `
  ${source}
  reduce(data, emit);
`));
////////////////////////////////////////////////////////////////////////////////

job.setReduce(reduce);

data.setData('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
job.setData(data);

const id = db.addJob(job);

console.log('\n===== Map Phase ====================');

// job.getMapMethod().getJs()(job.getData().getData(), (key, value) => {
//   job.addMapResultPair(key, value);
// });

job.getMapMethod().getJs()(job.getData().getData(), (key, value) => {
  job.addMapResultPair(key, value);
});

setTimeout(() => {

  console.log('\n===== Map Result ====================');

  console.log(job.getMapResult().getPairs());

  console.log('\n===== Reduce Phase ====================');

  job.getReduce().getJs()(job.getMapResult().getPairs(), (key, value) => {
    job.addReduceResultPair(key, value);
  })

  setTimeout(() => {

    console.log('\n===== Reduce Result ====================');

    console.log(job.getReduceResult().getPairs());

  }, 100);

}, 100);
