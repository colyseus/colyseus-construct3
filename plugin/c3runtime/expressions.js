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

  C3.Plugins.Colyseus_SDK.Exps =
  {
    RoomId()
    {
      return this.room && this.room.roomId;
    },

    SessionId()
    {
      return this.room && this.room.sessionId;
    },

    ReconnectionToken()
    {
      return this.room && this.room.reconnectionToken;
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

    CurrentMessage() {
      return this.lastMessage;
    },

    CurrentMessageAt(path) {
      return getDeepVariable(path, this.lastMessage);
    },

    CurrentMessageType() {
      return this.lastType;
    },

    CurrentVariablePath() {
      return this.lastPath;
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
