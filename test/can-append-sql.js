var test = require('tap').test
var assert = require('assert');

var sql = require('../');

test('can append sub sql objects', function (t) {
	var expectedSQL = 'select $1; select $2; select $3; select $4 select $2; select $3;';
	var expectedArgs = [ 'test0', 'test1', 'test2', 'test3' ];

	var query1 = sql()
		.append('select $1;', ['test1'])
		.append('select $1;', ['test2']);

	var query = sql()
		.append('select $1;', ['test0'])
		.append(query1)
		.append('select $1', ['test3'])
		.append(query1)
		.toQuery();

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});


