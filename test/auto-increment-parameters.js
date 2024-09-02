import tap from 'tap';
import assert from 'assert';
import SqlBuilderFactory from '../index.mjs';
var sql = SqlBuilderFactory();

tap.test('parameters are automatically incremented', function (t) {
	var expectedSQL = 'select $1; select $2;';
	var expectedArgs = ['test1', 'test2'];

	var query = sql()
		.append('select $1;', ['test1'])
		.append('select $1;', ['test2'])

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});

