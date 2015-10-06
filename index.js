exports = module.exports = Sql;
var slice = Array.prototype.slice;

function Sql(parts) {
	if(!(this instanceof Sql)) return new Sql(parts);
	this._parts = parts || [];
}

Sql.escape = function (v, quote) {
	if(!quote) quote = "'";
	return ((v||'').toString().replace(RegExp('[' + quote + ']', 'g'), function(m) { return m + m }));
}

Sql.prototype.append = function append(sql, args) {
	if((sql instanceof Sql)) {
		var built = sql.toQuery();
		sql = built.text;
		args = built.parameters;
	}

	if(args && (args instanceof Array) && (args[0] instanceof Array) && args[0].length === 0) {
		throw new Error("Nested arrays cannot be used as sql parameter.");
	}

	return new Sql(this._parts.concat([[sql, args || []]]));
};

Sql.prototype.wrap = function wrap(prefix, txt, suffix, args) {
	return this.append(prefix || '').append(txt, args).append(suffix || '');
};

Sql.prototype.select = function select(args) { return this.append('SELECT ' + slice.call(arguments).join(',')); };
Sql.prototype.from = function from(args) { return this.append('FROM ' + slice.call(arguments).join(',')); };
Sql.prototype.where = function where(txt, args) { return this.wrap('WHERE (', txt, ')', args); };
Sql.prototype.or = function or(txt, args) { return this.wrap('OR (', txt, ')', args); };
Sql.prototype.and = function and(txt, args) { return this.wrap('AND (', txt, ')', args); };
Sql.prototype.orderBy = function orderBy(args) { return this.append('ORDER BY ' + slice.call(arguments).join(',')); };
Sql.prototype.groupBy = function groupBy(args) { return this.append('GROUP BY ' + slice.call(arguments).join(',')); };

Sql.prototype.toQuery = function toQuery() {
	if (this._built !== undefined) return this._built;
	var sqlList = [], argList = [], argCount = 0;
	var outputArguments = new Map();
	for(var i=0; i<this._parts.length; ++i) {
		var txt = this._parts[i][0];
		var args = this._parts[i][1];
		txt = txt.replace(/(?!\\)\$(\d+)/g, function (m, idx) {
			var argumentValue = args[Number(idx) - 1];
			var savedIndex = outputArguments.get(argumentValue);
			if (savedIndex === undefined) {
				argCount += 1;
				savedIndex = argCount;
				argList.push(argumentValue);
				outputArguments.set(argumentValue, savedIndex);
			}
			return '$' + savedIndex;
		});
		sqlList.push(txt);
	}
	this._built = { text: sqlList.join(' '), parameters: argList };
	return this._built;
};

