"use strict";

{
  function getDeepVariable (path, container) {
    var path = path.split(".");
    var value = container;

    // deeply get the requested variable from the room's state.
    try {
      do {
        value = (typeof(value.get)!=="function") // MapSchema's .get() method
          ? value[path.shift()]
          : value.get(path.shift());
      } while (path.length > 0);
    } catch (e) {
      console.warn(e);
      return null;
    }

    return value;
  }

  C3.Plugins.Colyseus.Exps =
  {
    SessionId()
    {
      return this.room && this.room.sessionId;
    },

    State(variablePath)
    {
      return getDeepVariable(variablePath, (this.room && this.room.state) || {});
    },

    // Path(variable) {
    //   return this.lastChange.path[variable];
    // },

    JSON(data) {
      return JSON.stringify(eval(`(${data})`));
    },

    CurrentIndex() {
      return this.lastIndex;
    },

    CurrentField() {
      return this.lastField;
    },

    CurrentValue() {
      return this.lastValue;
    },

    CurrentValueAt(path) {
      return getDeepVariable(path, this.lastValue);
    },

    ErrorMessage() {
      return this.lastError && this.lastError.message;
    },

    ErrorCode() {
      return this.lastError && this.lastError.code;
    },

  };
}
