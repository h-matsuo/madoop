mergeInto(LibraryManager.library, {
  emit_func: function (key, value) {
    execEmit(Pointer_stringify(key), Pointer_stringify(value));
  }
});
