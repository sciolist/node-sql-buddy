# sql-buddy

Just tracks parameter orders for sql queries.

## Usage

You can piece together your sql by appending query bits:

    var sql = require('sql-buddy')();

    var query = sql('select $0;', ['one'])
      .append('select $0;', ['two'])
      .toQuery();

    query.text;       // 'select $0; select $1;'
    query.names;      // ['$0', '$1'];
    query.parameters; // ['one', 'two'];

Parameters are deduplicated:

    var sql = require('sql-buddy');

    var query = sql()
      .append('select $0;', ['one'])
      .append('select $0, $1;', ['two', 'one'])
      .toQuery();

    query.text;      // 'select $0; select $1, $0;'
    query.names;     // ['$0', '$1'];
    query.parameter; // ['one', 'two'];

Also a very basic sql quote escape:

    var sql = require('sql-buddy');
    sql.escape("te'st"); // te''st

Options:

    var sql = require('sql-buddy')({
        variablePrefix: '$',   // change the '$' prefix to another character, such as '@' for mssql
        
        // change how the parameter name is built
        formatParameterName(index, opts) { return '$' + index }

        // change the parameter value before 
        formatParameterValue(value, opts) {
            if (value instanceof Date) return +value;
            return value;
        }
    })
