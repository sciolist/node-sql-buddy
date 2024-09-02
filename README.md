# sql-buddy

Just tracks parameter orders for sql queries.

## Options

    import SqlBuddy, { pgsql } from 'sql-buddy';
    
    const sql = SqlBuddy({
        // change the '$' prefix to another character, such as '@' for mssql
        parameterNamePrefix: '$',
        
        // change how the parameter name is built
        parameterNameFormat(index, opts) { return '$' + index }

        // change the parameter value before sending
        parameterValueFormat(value, opts) {
            if (value instanceof Date) return +value;
            return value;
        }
    });

    sql('select 1');

    // there is also a postgres default as 'pgsql';

    pgsql('select 1');


## Usage

You can piece together your sql by appending query bits:

    import { pgsql } from 'sql-buddy';

    const query = pgsql`select ${'one'}` // using template strings
      .append('select $1;', ['two']);    // or parameter arrays

    query.text;       // 'select $1; select $2;'
    query.names;      // ['$1', '$2'];
    query.values;     // ['one', 'two'];

Parameters are deduplicated:

    import { pgsql } from 'sql-buddy';

    const query = pgsql()
      .append`select ${'one'};`
      .append`select ${'two'}, ${'one'};`

    query.text;      // 'select $1; select $2, $1;'
    query.names;     // ['$1', '$2'];
    query.values;    // ['one', 'two'];

You can also append an array of values, which will automatically place commas between each:

    import { pgsql } from 'sql-buddy';
    const values = [{ id: 'one' }, { id: 'two' }]

    const query = pgsql()
      .append`insert into mytable values`
      .multiAppend(values, (q, it) => q`(${it.id})`)

    query.text;      // 'insert into mytable values ($1) , ($2)'
    query.names;     // ['$1', '$2'];
    query.values;    // ['one', 'two'];

## Postgres example

```
import pg from 'pg';
import { pgsql } from 'sql-buddy'; // use default settings for postgresql

const conn = new pg.Client();
await conn.connect();

const id = 5;

const result = await conn.query(pgsql`select * from mytable where id = ${id}`);

console.log(result.rows);
```
