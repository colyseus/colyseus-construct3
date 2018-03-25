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
	var rooms = {};
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
	Cnds.prototype.OnOpen = function ()
	{
		return true;
	};

	Cnds.prototype.OnClose = function ()
	{
		return true;
	};

	Cnds.prototype.OnClientError = function ()
	{
		return true;
	};

	/**
	 * Conditions for Room
	 */

	Cnds.prototype.OnJoinRoom = function (roomName)
	{
		return true;
	};

	Cnds.prototype.OnLeaveRoom = function (roomName)
	{
		return true;
	};


	Cnds.prototype.OnRoomError = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Connect = function ()
	{
		var self = this;
		this.client = new Colyseus.Client(this.endpoint);
		this.client.onError.add(function() { self.runtime.trigger(pluginProto.cnds.OnClientError, self); });
		this.client.onOpen.add(function() { self.runtime.trigger(pluginProto.cnds.OnOpen, self); });
		this.client.onClose.add(function() { self.runtime.trigger(pluginProto.cnds.OnClose, self); });
	};

	Acts.prototype.Disconnect = function ()
	{
		var self = this;
		if (this.client) {
			this.client.close();
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

		rooms[roomName] = this.client.join(roomName, options);
		rooms[roomName].onError.add(function () {
			self.runtime.trigger(pluginProto.cnds.OnRoomError, self);
		});
		rooms[roomName].onJoin.add(function () {
			self.runtime.trigger(pluginProto.cnds.OnJoinRoom, self);
		});
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.Double = function (ret, number)
	{
		ret.set_float(number * 2);
	};

	pluginProto.exps = new Exps();

}());
