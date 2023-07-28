"use strict";

{
  var Colyseus = globalThis['Colyseus'];

  const stringifyOrValue = (value) => 
    typeof value === 'object' ?
    JSON.stringify(value) :
    value;

  C3.Plugins.Colyseus_SDK.Exps =
  {
    RoomId() { return this.room && this.room.roomId; },
    RoomName() { return this.room && this.room.name; },
    SessionId() { return this.room && this.room.sessionId; },
    ReconnectionToken() { return this.room && this.room.reconnectionToken; },
    CloseCode() { return this.lastCloseCode || -1; },
    Endpoint() { return this.endpoint; },

    JSON(data) { return JSON.stringify(eval(`(${data})`)); },

    // Messages
    MessageValue() { return stringifyOrValue(this.lastMessage); },
    MessageValueAt(path) { return stringifyOrValue(this.getDeepVariable(path, this.lastMessage)); },
    MessageType() { return this.lastType; },
    MessageValueType() { return typeof (this.lastMessage); },
    MessageValueAtType(path) { return typeof (this.getDeepVariable(path, this.lastMessage)); },

    // State
    State(variablePath) { return stringifyOrValue(this.getDeepVariable(variablePath, (this.room && this.room.state) || {})); },
    CurrentStatePath() { return this.lastPath; },

    CurrentKey() { return this.lastKey; },
    CurrentValue() { return stringifyOrValue(this.lastValue); },
    CurrentValueAt(path) { return stringifyOrValue(this.getDeepVariable(path, this.lastValue)); },
    PreviousValue() { return stringifyOrValue(this.lastPreviousValue); },

    // Collections
    CurrentItemsCount() {
      const collection = this.lastCollection || "";
      return (typeof (collection.indexOf) === "function"
        ? (collection.length || 0)
        : (collection.size || 0));
    },
    CountItemsAt(path) {
      const collection = this.getDeepVariable(path, (this.room && this.room.state));
      return (typeof(collection.indexOf) === "function"
        ? (collection.length || 0)
        : (collection.size || 0));
    },

    // Errors
    ErrorMessage() { return (this.lastError && this.lastError.message) || ""; },
    ErrorCode() { return (this.lastError && this.lastError.code) || -1; },

    ErrorCode_SDK_EXCEPTION() { return -1; },
    ErrorCode_SERVER_OFFLINE() { return 0; },
    ErrorCode_NO_HANDLER() { return Colyseus.ErrorCode.MATCHMAKE_NO_HANDLER; },
    ErrorCode_INVALID_CRITERIA() { return Colyseus.ErrorCode.MATCHMAKE_INVALID_CRITERIA; },
    ErrorCode_INVALID_ROOM_ID() { return Colyseus.ErrorCode.MATCHMAKE_INVALID_ROOM_ID; },
    ErrorCode_UNHANDLED() { return Colyseus.ErrorCode.MATCHMAKE_UNHANDLED; },
    ErrorCode_EXPIRED() { return Colyseus.ErrorCode.MATCHMAKE_EXPIRED; },
    ErrorCode_AUTH_FAILED() { return Colyseus.ErrorCode.AUTH_FAILED; },
    ErrorCode_APPLICATION_ERROR() { return Colyseus.ErrorCode.APPLICATION_ERROR; },

  };
}
