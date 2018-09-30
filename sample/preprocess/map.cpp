#include <iostream>

extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit_func(const char*, const char*); // REQUIRED to emit key-value pairs

  void map(const char* data)
  {
    std::cout << "received data (preprocessed by wasm_map_preprocess.js):"
              << std::endl << data << std::endl;
    emit_func("this-key-will-be-overwritten-by-wasm_reduce_preprocess.js", data);
  }

}
