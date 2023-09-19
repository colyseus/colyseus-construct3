"use strict";

{
  var Colyseus = globalThis['Colyseus'];

  C3.Plugins.Colyseus_SDK.Acts =
  {
    SetEndpoint(endpoint)
    {
      this.endpoint = endpoint || this.endpoint;
      this.client = new Colyseus.Client(this.endpoint);
    },

    JoinRoom (roomName, options)
    {
      this._MatchMake("join", roomName, options);
    },

    JoinOrCreateRoom (roomName, options)
    {
      this._MatchMake("joinOrCreate", roomName, options);
    },

    CreateRoom (roomName, options)
    {
      this._MatchMake("create", roomName, options);
    },

    JoinRoomById (roomId, options)
    {
      this._MatchMake("joinById", roomId, options);
    },

    ConsumeSeatReservation (reservation) {
      this._MatchMake("consumeSeatReservation", undefined, reservation);
    },

    ReconnectRoom (reconnectionToken)
    {
      this._MatchMake("reconnect", undefined, reconnectionToken);
    },

    RoomSend (type, message)
    {
      if (this.room && this.room.connection) {
        this.room.send(type, message);

      } else {
        console.log("RoomSend: not connected.");
      }
    },

    RoomSendJSON (type, message)
    {
      C3.Plugins.Colyseus_SDK.Acts.RoomSend.call(this, type, JSON.parse(message));
    },

    RoomLeave (consented)
    {
      if (this.room) {
        this.room.leave(consented);
      }
    },

    GetAvailableRooms(roomName)
    {
      var self = this;
      this.client.getAvailableRooms(roomName).then(rooms => {
        if (self.debug)
        {
          console.info("⚔️ Colyseus ➡️ Get Available Rooms:");
          rooms.forEach((room) => {
            console.info(room.roomId);
            console.info(room.clients);
            console.info(room.maxClients);
            console.info(room.metadata);
          });
        }
        self.lastValue = rooms;
        self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnGetAvailableRooms);
      }).catch(function(err) {
        if (self.debug)
        {
          console.error("⚔️ Colyseus ➡️ Get Available Rooms error: " + err.message);
        }
        self.lastError = err;
        self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnRoomError);
      });
    },

  };

}
