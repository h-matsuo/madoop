mergeInto(LibraryManager.library, {
  emit: function (key, value) {
    execEmit(Pointer_stringify(key), Pointer_stringify(value));
  }
});
