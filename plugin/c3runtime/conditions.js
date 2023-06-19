"use strict";

{
  const operations = ['any', 'add', 'replace', 'remove'];
  const ANY = ":any:";

  function checkPath (lastPath, path) {
    if (lastPath === path) {
      return true;

    } else if (path.indexOf(ANY) >= 0) {
      const lastSegments = lastPath.split(".");
      const segments = path.split(".");

      if (lastSegments.length === segments.length) {
        for (const i = 0; i < segments.length; i++) {
          if (segments[i] !== ANY && segments[i] !== lastSegments[i]) {
            return false;
          }
        }
        return true;

      } else {
        return false;
      }

    } else {
      return false;
    }
  }

  C3.Plugins.Colyseus_SDK.Cnds =
  {
    // Matchmaking
    OnGetAvailableRooms() { return true; },
    OnJoinRoom() { return true; },
    OnJoinError() { return true; },
    OnAnyError() { return true; },
    ForEachRoomAvailable() {
      const self = this;
      if (self.lastValue && self.lastValue.length > 0) {
        const runtime = this._runtime;
        const eventSheetManager = runtime.GetEventSheetManager();
        const currentEvent = runtime.GetCurrentEvent();
        const solModifiers = currentEvent.GetSolModifiers();
        const eventStack = runtime.GetEventStack();

        // Get current stack frame and push new one
        const oldFrame = eventStack.GetCurrentStackFrame();
        const newFrame = eventStack.Push(currentEvent);

        const rooms = self.lastValue;
        rooms.forEach(function (item, key) {
          self.lastKey = key;
          self.lastValue = item;

          // Push a copy of the current SOL
          eventSheetManager.PushCopySol(solModifiers);

          // Retrigger the current event, running a single loop iteration
          currentEvent.Retrigger(oldFrame, newFrame);

          // Pop the current SOL
          eventSheetManager.PopSol(solModifiers);
        });

        // Pop the event stack frame
        eventStack.Pop();
      }
      // Return false since event already executed
      return false;
    },

    // Room
    OnLeaveRoom() { return true; },
    OnRoomError() { return true; },
    OnStateChange() { return true; },
    OnMessage(type) {
      return (
        type === "*" ||
        this.lastType === type
      );
    },

    // Messages
    CompareMessageType(cmp, type) { return C3.compare(this.lastType, cmp, type); },
    CompareMessageValue(cmp, value) { return C3.compare(this.lastMessage, cmp, value); },
    CompareMessageValueAt(path, cmp, value) { return C3.compare(this.getDeepVariable(path, this.lastMessage), cmp, value);  },
    CompareMessageValueOfType(cmp, type) { return C3.compare(typeof (this.lastMessage), cmp, type); },
    CompareMessageValueAtOfType(path, cmp, type) { return C3.compare(typeof (this.getDeepVariable(path, this.lastMessage)), cmp, type); },

    // State/Schema
    OnChangeAtPath(path) { return checkPath(this.lastPath, path); },
    CompareStateValueAt(path, cmp, value) { return C3.compare(this.getDeepVariable(path, this.room && this.room.state), cmp, value); },

    // State/Schema/Collections
    OnCollectionItemAdd(path) { return this.lastCollectionPath === path; },
    OnCollectionItemRemove(path) { return this.lastCollectionPath === path; },
    OnCollectionItemChange(path) { return this.lastCollectionPath === path; },
    CompareItemsAtCount(path, cmp, count) {
      const collection = this.getDeepVariable(path, (this.room && this.room.state));
      const itemsCount = (typeof(collection.indexOf) === "function"
        ? (collection.length || 0)
        : (collection.size || 0));
      return C3.compare(itemsCount, cmp, count);
    },
    CompareCurrentItemsCount(cmp, count) {
      const collection = this.lastCollection || "";
      const itemsCount = (typeof(collection.indexOf) === "function"
        ? (collection.length || 0)
        : (collection.size || 0));
      return C3.compare(itemsCount, cmp, count);
    },
    ArrayHasValue(path, value) {
      const arr = this.getDeepVariable(path, this.room && this.room.state);
      return arr && typeof (arr.includes) === "function" && arr.includes(value)
    },
    MapHasKey(path, key) {
      const map = this.getDeepVariable(path, this.room && this.room.state);
      return map && typeof (map.has) === "function" && map.has(key);
    },

    // State
    CompareCurrentKey(cmp, key) { return C3.compare(this.lastKey, cmp, key); },
    CompareCurrentValue(cmp, value) { return C3.compare(this.lastValue, cmp, value); },
    CompareCurrentValueAt(path, cmp, value) { return C3.compare(this.getDeepVariable(path, this.lastValue), cmp, value); },
    ForEachItemAt(path) {
      const self = this;
      const collection = this.getDeepVariable(path, this.room && this.room.state);
      const validCollection = (collection && typeof (collection.forEach) === "function");
      if (validCollection) {
        // Get necessary references
        // https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/event-sheet-classes/eventblock#internalH1Link0
        const runtime = this._runtime;
        const eventSheetManager = runtime.GetEventSheetManager();
        const currentEvent = runtime.GetCurrentEvent();
        const solModifiers = currentEvent.GetSolModifiers();
        const eventStack = runtime.GetEventStack();

        this.lastCollectionPath = path;
        this.lastCollection = collection;

        // Get current stack frame and push new one
        const oldFrame = eventStack.GetCurrentStackFrame();
        const newFrame = eventStack.Push(currentEvent);

        collection.forEach(function (item, key) {
          self.lastKey = key;
          self.lastPath = path + "." + key;
          self.lastValue = item;

          // Push a copy of the current SOL
          eventSheetManager.PushCopySol(solModifiers);

          // Retrigger the current event, running a single loop iteration
          currentEvent.Retrigger(oldFrame, newFrame);

          // Pop the current SOL
          eventSheetManager.PopSol(solModifiers);
        });

        // Pop the event stack frame
        eventStack.Pop();
      }
      // Return false since event already executed
      return false;
    },

    // Error handling
    HasErrorCode(cmp, code) { return this.lastError && C3.compare(this.lastError.code, cmp, code); },
    HasErrorMessage(cmp, message) { return this.lastError && C3.compare(this.lastError.message, cmp, message); }

  };
}
