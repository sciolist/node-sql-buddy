exports = module.exports = SqlBuilderFactory;
var slice = Array.prototype.slice;

function Sql(options) {
	this._parts = [];
	this._options = options;
}

Sql.prototype.append = function append(text, parameters) {
	delete this._built;

	if (text && text.toQuery instanceof Function) {
		let query = text.toQuery();
		text = query.text;
		parameters = query.parameters;
	}

	if(parameters && (parameters instanceof Array) && (parameters[0] instanceof Array) && parameters[0].length === 0) {
		throw new Error("Nested arrays cannot be used as sql parameter.");
	}

	this._parts.push(text, parameters);
	return this;
}

Sql.prototype.toQuery = function toQuery() {
	var self = this;
	var prefix = this._options.parameterNamePrefix;
	if (this._built !== undefined) return this._built;
	var sqlList = [], argList = [], argNameList = [], argCount = 0;
	var outputArguments = new Map();
	for(var i=0; i<this._parts.length; i+=2) {
		var txt = this._parts[i];
		var args = this._parts[i + 1] || [];
		txt = txt.replace(new RegExp('(?!\\\\)\\' + (prefix) + '(\\d+)', 'g'), function (m, idx) {
			var parameterName;
			var parameterValue = self._options.parameterValueFormat(args[Number(idx) - 1]);
			var savedIndex = outputArguments.get(parameterValue);
			if (savedIndex === undefined) {
				argCount += 1;
				savedIndex = argCount;
				parameterName = self._options.parameterNameFormat(savedIndex, self._options);
				argNameList.push(parameterName);
				argList.push(parameterValue);
				outputArguments.set(parameterValue, savedIndex);
			} else {
				parameterName = self._options.parameterNameFormat(savedIndex, self._options);
			}
			return self._options.parameterNameFormat(savedIndex, self._options);
		});
		sqlList.push(txt);
	}
	this._built = {
		text: sqlList.join(' '),
		names: argNameList,
		parameters: argList
	};
	return this._built;
};


function SqlBuilderFactory(options) {
	var opts = Object.assign({
		parameterNamePrefix: '$',
		parameterNameFormat(name, opts) { return opts.parameterNamePrefix + name; },
		parameterValueFormat(value, opts) { return value; }
	}, opts);

	function builder(text, parameters) {
		let sql = new Sql(opts);
		if (arguments.length > 0) sql.append(text, parameters);
		return sql;
	}

	builder.escape = function escape(v, quote) {
		if(!quote) quote = "'";
		return ((v||'').toString().replace(RegExp('[' + quote + ']', 'g'), function(m) { return m + m }));
	}

	return builder;
}
