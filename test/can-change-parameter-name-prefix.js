var test = require('tap').test
var assert = require('assert');

var sql = require('../')({ parameterNamePrefix: '@' });

test('can change parameter name prefix', function (t) {
	var expectedSQL = 'select @1, @1';
	var expectedArgs = ['test1'];
	
	var query = sql()
		.append('select @1, @2', ['test1', 'test1'])
		.toQuery();

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});



