"use strict";

{
  function getDeepVariable (path, container) {
    var path = path.split(".");
    var value = container;

    // deeply get the requested variable from the room's state.
    try {
      do {
        value = value[path.shift()];
      } while (path.length > 0);
    } catch (e) {
      console.warn(e);
      return null;
    }

    return value;
  }

  C3.Plugins.Colyseus.Exps =
  {
    Double(number)
    {
      return number * 2;
    },

    SessionId()
    {
      return this.room.sessionId;
    },

    State(variablePath)
    {
      return getDeepVariable(variablePath, this.room.state);
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

    CurrentValue() {
      return this.lastValue;
    },

    CurrentValueAt(path) {
      return getDeepVariable(path, this.lastValue);
    },

  };
}
