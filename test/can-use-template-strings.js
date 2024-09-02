import tap from 'tap';
import assert from 'assert';
import SqlBuilderFactory from '../index.mjs';
var sql = SqlBuilderFactory();

tap.test('can use tagged template literals', function (t) {
	var expectedSQL = 'select $1, $1';
	var expectedArgs = ['test1'];
	
	var query = sql()
		.append`select ${'test1'},`
        .append`${'test1'}`

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});
