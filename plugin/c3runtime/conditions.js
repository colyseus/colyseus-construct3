"use strict";

{
  const operations = ['any', 'add', 'replace', 'remove'];

  C3.Plugins.Colyseus.Cnds =
  {
    /**
     * Conditions for Client
     */
    OnOpen() { return true; },
    OnClose() { return true; },
    OnClientError() { return true; },

    /**
     * Conditions for Room
     */
    OnJoinRoom() { return true; },
    OnLeaveRoom() { return true; },
    OnRoomError() { return true; },
    OnStateChange() { return true; },
    OnMessage(type) {
      return (this.lastType === type);
    },

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
    },

  };
}
