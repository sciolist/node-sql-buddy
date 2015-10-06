# sql-buddy

Just tracks parameter orders for sql queries.

## Usage

You can piece together your sql by appending query bits:

    var sql = require('sql-buddy');

    var query = sql()
      .append('select $1;', ['one'])
      .append('select $1;', ['two'])
      .toQuery();

    query.text; // 'select $1; select $2;'
    query.parameters; // ['one', 'two'];

Parameters are deduplicated:

    var sql = require('sql-buddy');

    var query = sql()
      .append('select $1;', ['one'])
      .append('select $1, $2;', ['two', 'one'])
      .toQuery();

    query.text; // 'select $1; select $2, $1;'
    query.parameters; // ['one', 'two'];

There are also a few helpers:

    var sql = require('sql-buddy');

    sql().select('name', 'age'); // append('SELECT name, age'); not escaped!
    sql().from('table'); // append('FROM table'); not escaped!
    sql().where('$1 > age', 33); // append('WHERE ($1 > age)', 33);
    sql().or('$1 < age', 33); // append('OR ($1 < age)', 33);
    sql().and('$1 == age', 33); // append('AND ($1 == age)', 33);
    sql().orderBy('name'); // append('ORDER BY name'); not escaped!
    sql().groupBy('age'); // append('GROUP BY age'); not escaped!

Also a very basic sql quote escape:

    var sql = require('sql-buddy');
    sql.escape("te'st"); // te''st

