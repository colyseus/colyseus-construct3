"use strict";

{
  var Colyseus = window['Colyseus'];
  var client;

  C3.Plugins.Colyseus.Acts =
  {
    Connect()
    {
      var self = this;

      if (!client) {
        client = new Colyseus.Client(this.endpoint);
      }

      this.client = client;
      this.client.onError.add(function() { self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnClientError, self); });
      this.client.onOpen.add(function() { self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnOpen, self); });
      this.client.onClose.add(function() { self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnClose, self); });
    },

    Disconnect()
    {
      if (client) {
        client.close();
      }
    },

    JoinRoom (roomName, optionsArr)
    {
      var self = this;
      var options = {};

      for (var i=0; i<optionsArr.length; i++) {
        var option = optionsArr[i].split("=");
        options[option[0]] = option[1];
      }

      this.room = client.join(roomName, options);
      this.listeners = {};

      this.room.onError.add(function () {
        self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnRoomError, self);
      });

      this.room.onJoin.add(function () {
        self.sessionId = self.room.sessionId;

        self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnJoinRoom, self);
      });

      this.room.onStateChange.add(function (state) {
        self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnStateChange, self);
      });

      this.room.onMessage.add(function (message) {
        self.lastValue = message;
        self.lastType = message.type;
        self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnMessage, self);
      });

      this.room.listen(function(change) {
        self.lastChange = change;
        self.lastValue = change.value;
        self._runtime.trigger(C3.Plugins.Colyseus.Cnds.OnRoomListen, self);
      });
    },

    RoomSend (data)
    {
      this.room.send(data);
    },

    RoomLeave()
    {
      if (this.room) {
        this.room.leave()
      }
    },

  };

}
