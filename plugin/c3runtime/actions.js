"use strict";

{
  var Colyseus = window['Colyseus'];

  C3.Plugins.Colyseus.Acts =
  {
    SetEndpoint(endpoint)
    {
      var self = this;

      this.client = new Colyseus.Client(endpoint || this.endpoint);
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

    ReconnectRoom (roomId, sessionId)
    {
      this._MatchMake("reconnect", roomId, sessionId);
    },

    RoomSend (type, data)
    {
      if (
        this.room &&
        this.room.connection &&
        this.room.connection.readyState === WebSocket.OPEN
      ) {
        this.room.send([type, JSON.parse(data)]);

      } else {
        console.log("RoomSend: not connected.");
      }
    },

    RoomLeave()
    {
      if (this.room) {
        this.room.leave()
      }
    },

  };

}
