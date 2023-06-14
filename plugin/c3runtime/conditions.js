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

    /* Schema Serializer */
    OnSchemaAdd(path) { return checkPath(this.lastPath, path); },
    OnSchemaChange(path) { return checkPath(this.lastPath, path); },
    OnSchemaFieldChange(path) { return checkPath(this.lastPath, path); },
    OnSchemaRemove(path) { return checkPath(this.lastPath, path); },

    IsIndex(index) { return this.lastIndex === index; },
    IsField(field) { return this.lastField === field; }

    /* Fossil Delta Serializer
    OnRoomListen(path, operationIndex) {
      var self = this;
      var change = this.lastChange;
      var operation = operations[operationIndex];

      // the operation doesn't match with the operation user is interested in.
      if (operation !== "any" && change.operation !== operation) {
        return false;
      }

      var rules = path.split("/");

      if (!this.listeners[path]) {
        rules = rules.map(function(segment) {
          // replace placeholder matchers
          return (segment.indexOf(":") === 0)
            ? self.room.matcherPlaceholders[segment] || self.room.matcherPlaceholders[":*"]
            : new RegExp("^" + segment + "$");
        });
        this.listeners[path] = rules;
      }

      if (change.path.length !== this.listeners[path].length) {
        return false;
      }

      for (var i = 0, len = this.listeners[path].length; i < len; i++) {
        let matches = change.path[i].match(this.listeners[path][i]);
        if (!matches || matches.length === 0 || matches.length > 2) {
          return false;
        }
      }

      // alright! let's execute the callback!
      return true;
    },*/

  };
}
