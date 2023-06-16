"use strict";

{
  C3.Plugins.Colyseus_SDK.Exps =
  {
    RoomId() { return this.room && this.room.roomId; },
    SessionId() { return this.room && this.room.sessionId; },
    ReconnectionToken() { return this.room && this.room.reconnectionToken; },
    CloseCode() { return this.lastCloseCode; },

    JSON(data) { return JSON.stringify(eval(`(${data})`)); },

    // Messages
    MessageValue() { return this.lastMessage; },
    MessageValueAt(path) { return this.getDeepVariable(path, this.lastMessage); },
    MessageType() { return this.lastType; },
    MessageValueType() { return typeof (this.lastMessage); },
    MessageValueAtType(path) { return typeof (this.getDeepVariable(path, this.lastMessage)); },

    // State
    State(variablePath) { return this.getDeepVariable(variablePath, (this.room && this.room.state) || {}); },
    CurrentStatePath() { return this.lastPath; },

    CurrentKey() { return this.lastKey; },
    CurrentValue() { return this.lastValue; },
    CurrentValueAt(path) { return this.getDeepVariable(path, this.lastValue); },

    // Collections
    CurrentItemsCount() {
      try {
        return (Array.isArray(this.lastCollection)
          ? this.lastCollection.length
          : this.lastCollection.size);

      } catch (e) {
        this.lastError = e;
        this.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnAnyError);
        return 0;
      }
    },
    CountItemsAt(path) {
      try {
        var collection = this.getDeepVariable(path, (this.room && this.room.state));
        return (Array.isArray(collection)
          ? collection.length
          : collection.size);

      } catch (e) {
        this.lastError = e;
        this.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnAnyError);
        return 0;
      }
    },

    // Errors
    ErrorMessage() { return this.lastError && this.lastError.message; },
    ErrorCode() { return this.lastError && this.lastError.code; },

  };
}
