import DataBase from './DataBase';
import Job from './Job';
import Map from './Map';
import Reduce from './Reduce';
import Language from './Language';

const db = new DataBase();
let job = new Job();
let map = new Map();
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

///// Example of C//////////////////////////////////////////////////////////////
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
map.setLanguage(Language.Cpp);
map.setSource(source);
map.compile();
////////////////////////////////////////////////////////////////////////////////

job.setMap(map);

const id = db.addJob(job);

map.getJs()('a i u e o a', (key, value) => { console.log(`${key}: ${value}`); });
