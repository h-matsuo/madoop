mergeInto(LibraryManager.library, {
  emit: function (key, value) {
    Module.print(Pointer_stringify(key));
    Module.print(Pointer_stringify(value));
  }
});
