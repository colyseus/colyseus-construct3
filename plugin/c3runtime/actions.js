"use strict";

{
  var Colyseus = window['Colyseus'];

  C3.Plugins.Colyseus.Acts =
  {
    Connect()
    {
      var self = this;

      this.client = new Colyseus.Client(this.endpoint);
      this.client.onError.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnClientError); });
      this.client.onOpen.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnOpen); });
      this.client.onClose.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnClose); });
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
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnRoomError);
      });

      this.room.onJoin.add(function () {
        self.sessionId = self.room.sessionId;

        self.Trigger(C3.Plugins.Colyseus.Cnds.OnJoinRoom);
      });

      this.room.onStateChange.add(function (state) {
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnStateChange);
      });

      this.room.onMessage.add(function (message) {
        self.lastValue = message;
        self.lastType = message.type;
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnMessage);
      });

      this.room.listen(function(change) {
        self.lastChange = change;
        self.lastValue = change.value;
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnRoomListen);
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
