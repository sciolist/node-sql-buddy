import tap from 'tap';
import assert from 'assert';
import SqlBuilderFactory from '../index.mjs';
var sql = SqlBuilderFactory();

tap.test('can use multiple value append', function (t) {
	var expectedSQL = 'insert into table values ($1) , ($2) , ($3)';
	var expectedArgs = ['test1', 'test2', 'test3'];
	
	var query = sql()
        .append`insert into table values`
        .multiAppend(expectedArgs, (q, it) => q`(${it})`)

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});

tap.test('can change multiple value append join character', function (t) {
	var expectedSQL = 'insert into table values ($1) - ($2) - ($3)';
	var expectedArgs = ['test1', 'test2', 'test3'];
	
	var query = sql()
        .append`insert into table values`
        .multiAppend(expectedArgs, (q, it) => q`(${it})`, { join: '-' })

	assert.equal(query.text, expectedSQL);
	assert.deepEqual(query.parameters, expectedArgs);
	t.end();
});
