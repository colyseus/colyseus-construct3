"use strict";

{
  const operations = ['any', 'add', 'replace', 'remove'];

  var ANY = ":any:";

  function checkPath (lastPath, path) {
    if (lastPath === path) {
      return true;

    } else if (path.indexOf(ANY) >= 0) {
      var lastSegments = lastPath.split(".");
      var segments = path.split(".");

      if (lastSegments.length === segments.length) {
        for (var i = 0; i < segments.length; i++) {
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

    // State
    CompareCurrentKey(cmp, key) { return C3.compare(this.lastKey, cmp, key); },
    CompareCurrentValue(cmp, value) { return C3.compare(this.lastValue, cmp, value); },
    CompareCurrentValueAt(path, cmp, value) { return C3.compare(this.getDeepVariable(path, this.lastValue), cmp, value); },
    ForEachItemAt(path) {
      var self = this;
      var collection = this.getDeepVariable(path, this.room && this.room.state);
      var validCollection = (collection && typeof (collection.forEach) === "function");
      if (validCollection) {
        // Get necessary references
        // https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/event-sheet-classes/eventblock#internalH1Link0
        var runtime = this._runtime;
        var eventSheetManager = runtime.GetEventSheetManager();
        var currentEvent = runtime.GetCurrentEvent();
        var solModifiers = currentEvent.GetSolModifiers();
        var eventStack = runtime.GetEventStack();

        this.lastCollectionPath = path;
        this.lastCollection = collection;

        // Get current stack frame and push new one
        var oldFrame = eventStack.GetCurrentStackFrame();
        var newFrame = eventStack.Push(currentEvent);

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
