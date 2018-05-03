#include <vector>
#include <string>
#include <sstream>

inline std::vector<std::string> split(const std::string &, char);

extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit_func(const char*, const char*); // REQUIRED to emit key-value pairs

  void reduce(const char* key, const char* values_str)
  {
    const std::string &data_str = std::string(values_str);
    const std::vector<std::string> &values = split(data_str, ',');
    double sum = 0;
    for (const auto value: values) {
      if (value == "") { continue; }
      sum += std::atof(value.c_str());
    }
    emit_func(key, std::to_string(sum).c_str());
  }

}

// Split `std::string` with `char`
inline std::vector<std::string> split(const std::string &str, char sep)
{
  std::vector<std::string> v;
  std::stringstream ss(str);
  std::string buffer;
  while(std::getline(ss, buffer, sep)) {
    v.push_back(buffer);
  }
  return v;
}
