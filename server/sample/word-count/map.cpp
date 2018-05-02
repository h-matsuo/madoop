#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>

std::vector<std::string> split(const std::string &, char);

extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit_func(const char*, const char*); // REQUIRED to emit key-value pairs

  void map(const char* data)
  {
    // Count the number of occurrences of each word
    const std::string &data_str = std::string(data);
    std::unordered_map<std::string, long> hashmap;
    const std::vector<std::string> &words = split(data_str, ' ');
    for (const auto &element: words) {
      hashmap[element]++;
    }
    // Emit key-value pairs
    for (const auto &element: hashmap) {
      const std::string &key   = element.first;
      const std::string &value = std::to_string(element.second);
      emit_func(key.c_str(), value.c_str());
    }
  }

}

// Split `std::string` with `char`
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
