# sql-buddy

Just tracks parameter orders for sql queries.

## Usage

You can piece together your sql by appending query bits:

    import SqlFactory from 'sql-buddy';
    const sql = SqlFactory();

    const query = sql`select ${'one'}` // using template strings
      .append('select $1;', ['two']);  // or parameter arrays

    query.text;       // 'select $1; select $2;'
    query.names;      // ['$1', '$2'];
    query.values;     // ['one', 'two'];

Parameters are deduplicated:

    import SqlFactory from 'sql-buddy';
    const sql = SqlFactory();

    const query = sql()
      .append`select ${'one'};`
      .append`select ${'two'}, ${'one'};`

    query.text;      // 'select $1; select $2, $1;'
    query.names;     // ['$1', '$2'];
    query.values;    // ['one', 'two'];

You can also append an array of values, which will automatically place commas between each:

    import SqlFactory from 'sql-buddy';
    const sql = SqlFactory();
    const values = [{ id: 'one' }, { id: 'two' }]

    const query = sql()
      .append`insert into mytable values`
      .multiAppend(values, (q, it) => q`(${it.id})`)

    query.text;      // 'insert into mytable values ($1) , ($2)'
    query.names;     // ['$1', '$2'];
    query.values;    // ['one', 'two'];

Options:

    import SqlFactory from 'sql-buddy';
    
    const sql = SqlFactory({
        // change the '$' prefix to another character, such as '@' for mssql
        parameterNamePrefix: '$',
        
        // change how the parameter name is built
        parameterNameFormat(index, opts) { return '$' + index }

        // change the parameter value before sending
        parameterValueFormat(value, opts) {
            if (value instanceof Date) return +value;
            return value;
        }
    })

## Postgres example

```
import pg from 'pg';
import { pgsql } from 'sql-buddy'; // uses default settings for postgresql

const conn = new pg.Client();
await conn.connect();

const id = 5;

const result = await conn.query(pgsql`select * from mytable where id = ${id}`);

console.log(result.rows);
```
