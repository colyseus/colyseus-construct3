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

	Cnds.prototype.OnConnect = function ()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Alert = function ()
	{
		alert("Test property = " + this.testProperty);
	};

	Acts.prototype.Connect = function ()
	{
		var self = this;
		this.client = new Colyseus.Client(this.endpoint);
		this.client.onOpen.add(function() {
			console.log("ON OPEN!");
			self.runtime.trigger(pluginProto.cnds.OnConnect, self);
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
