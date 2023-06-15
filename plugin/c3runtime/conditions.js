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
    /**
     * Conditions for Room
     */
    OnJoinRoom() { return true; },
    OnLeaveRoom() { return true; },
    OnError() { return true; },
    OnStateChange() { return true; },
    OnGetAvailableRooms() { return true; },
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
    CompareMessageValueAtOfType(path, cmp, type) { return this.getDeepVariable(path, this.lastMessage) === type; },

    // State/Schema
    OnChangeAtPath(path) { return checkPath(this.lastPath, path); },

    // State/Schema/Collections
    OnCollectionItemAdd(path) { return checkPath(this.lastPath, path); },
    OnCollectionItemRemove(path) { return checkPath(this.lastPath, path); },
    OnCollectionItemChange(path) { return checkPath(this.lastPath, path); },

    // State
    IsIndex(index) { return this.lastIndex === index; },
    IsField(field) { return this.lastField === field; }

  };
}
