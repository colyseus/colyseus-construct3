// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Colyseus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var client;
	var pluginProto = cr.plugins_.Colyseus.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

		// Initialise object properties
		this.endpoint = "";
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		// Read properties set in C3
		this.endpoint = this.properties[0];
	};

	instanceProto.saveToJSON = function ()
	{
		return {};
	};

	instanceProto.loadFromJSON = function (o)
	{
	};

	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	/**
	 * Conditions for Client
	 */
	Cnds.prototype.OnOpen = function () { return true; };
	Cnds.prototype.OnClose = function () { return true; };
	Cnds.prototype.OnClientError = function () { return true; };

	/**
	 * Conditions for Room
	 */

	Cnds.prototype.OnJoinRoom = function () { return true; };
	Cnds.prototype.OnLeaveRoom = function () { return true; };
	Cnds.prototype.OnRoomError = function () { return true; };
	Cnds.prototype.OnRoomListen = function (path, operation) {
		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Connect = function ()
	{
		var self = this;

		if (!client) {
			client = new Colyseus.Client(this.endpoint);
		}

		this.client = client;
		this.client.onError.add(function() { self.runtime.trigger(pluginProto.cnds.OnClientError, self); });
		this.client.onOpen.add(function() { self.runtime.trigger(pluginProto.cnds.OnOpen, self); });
		this.client.onClose.add(function() { self.runtime.trigger(pluginProto.cnds.OnClose, self); });
	};

	Acts.prototype.Disconnect = function ()
	{
		if (client) {
			client.close();
		}
	};

	Acts.prototype.JoinRoom = function (roomName, optionsArr)
	{
		var self = this;
		var options = {};

		for (var i=0; i<optionsArr.length; i++) {
			var option = optionsArr[i].split("=");
			options[option[0]] = option[1];
		}

		this.room = client.join(roomName, options);

		this.room.onError.add(function () {
			self.runtime.trigger(pluginProto.cnds.OnRoomError, self);
		});

		this.room.onJoin.add(function () {
			self.sessionId = self.room.sessionId;

			self.runtime.trigger(pluginProto.cnds.OnJoinRoom, self);
		});

		this.room.onStateChange.add(function (state) {
			self.runtime.trigger(pluginProto.cnds.OnStateChange, self);
		});
	};

	Acts.prototype.RoomSend = function (data)
	{
		this.room.send(data);
	}

	Acts.prototype.RoomLeave = function ()
	{
		if (this.room) {
			this.room.leave()
		}
	}

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.SessionId = function (ret)
	{
		ret.set_string(this.room.sessionId);
	};

	Exps.prototype.State = function (ret, variablePath)
	{
		var path = variablePath.split(".");
		var value = this.room.data;

		// deeply get the requested variable from the room's state.
		do {
			value = value[path.shift()];
		} while (path.length > 0);

		ret.set_any(value);
	};

	Exps.prototype.OperationAdd = function (ret) {
        ret.set_string("add");
    };

	Exps.prototype.OperationReplace = function (ret) {
        ret.set_string("replace");
    };

	Exps.prototype.OperationDelete = function (ret) {
        ret.set_string("delete");
    };

	pluginProto.exps = new Exps();

}());
