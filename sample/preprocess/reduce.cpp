extern "C" { // REQUIRED to prevent C++ name mangling

  extern void emit_func(const char*, const char*); // REQUIRED to emit key-value pairs

  void reduce(const char* key, const char* values_str)
  {
    emit_func(key, values_str);
  }

}
