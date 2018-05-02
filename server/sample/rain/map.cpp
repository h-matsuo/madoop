#include <vector>
#include <string>
#include <sstream>
#include <regex>

inline std::vector<std::string> split(const std::string &, char);
inline bool is_number(const std::string &);

extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit_func(const char*, const char*); // REQUIRED to emit key-value pairs

  void map(const char* input_data)
  {
    const std::string &data_str = std::string(input_data);
    const std::vector<std::string> &lines = split(data_str, '\n');
    for (const auto line: lines) {
      if (line == "") { continue; }
      const std::vector<std::string> &elements = split(line, ',');
      const std::string city_name = elements[0];
      const std::string rain = elements[2];
      if (!is_number(rain)) { continue; }
      emit_func(city_name.c_str(), rain.c_str());
    }
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

static const std::regex NUMBER_TYPE("[+-]?[0-9]+[.]?[0-9]*");
inline bool is_number(const std::string &str)
{
  return std::regex_match(str, NUMBER_TYPE);
}
