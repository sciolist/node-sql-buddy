import tap from 'tap';
import assert from 'assert';
import SqlBuilderFactory from '../index.mjs';
var sql = SqlBuilderFactory();

tap.test('can dedupe parameters', function (t) {
	var expectedSQL = 'select $1, $1';
	var expectedArgs = ['test1'];
	
	var query = sql()
		.append('select $1, $2', ['test1', 'test1'])
		.toQuery();

		console.log(query);
	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});



