import tap from 'tap';
import assert from 'assert';
import SqlBuilderFactory from '../index.mjs';
var sql = SqlBuilderFactory({ parameterNamePrefix: '@' });

tap.test('can change parameter name prefix', function (t) {
	var expectedSQL = 'select @1, @2';
	var expectedArgs = ['test1', 'test2'];
	
	var query = sql()
		.append('select @1, @2', ['test1', 'test2'])

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});



