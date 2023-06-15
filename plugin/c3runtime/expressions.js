"use strict";

{
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
      return this.getDeepVariable(variablePath, (this.room && this.room.state) || {});
    },

    // Path(variable) {
    //   return this.lastChange.path[variable];
    // },

    JSON(data) {
      return JSON.stringify(eval(`(${data})`));
    },

    CurrentField() {
      return this.lastField;
    },

    CurrentValue() {
      return this.lastValue;
    },

    CurrentValueAt(path) {
      return this.getDeepVariable(path, this.lastValue);
    },

    MessageValue() {
      return this.lastMessage;
    },

    MessageValueAt(path) {
      return this.getDeepVariable(path, this.lastMessage);
    },

    MessageType() {
      return this.lastType;
    },

    MessageValueType() {
      return typeof (this.lastMessage);
    },

    MessageValueAtType(path) {
      return typeof (this.getDeepVariable(path, this.lastMessage));
    },

    CurrentStatePath() {
      return this.lastPath;
    },

    CloseCode() {
      return this.lastCloseCode;
    },

    ErrorMessage() {
      return this.lastError && this.lastError.message;
    },

    ErrorCode() {
      return this.lastError && this.lastError.code;
    },

  };
}
