export type SqlBuilderOptions = {
    parameterNamePrefix?: string;
    parameterNameFormat?(name: string, opts: SqlBuilderOptions): string;
    parameterValueFormat?(value: any, opts: SqlBuilderOptions): any;
};

interface Queryable {
    text: string;
    values: any[];
}

type SqlBuilderFunction = (() => Sql)
    & ((text: string, parameters?: any[]) => Sql)
    & ((sql: Queryable) => Sql)
    & ((strings: TemplateStringsArray, ...parameters: any[]) => Sql);

export class Sql {
    built: undefined | { text: string; parameters: any[]; names: string[]; }
    parts: Array<[string[], any[]]>;
    options: SqlBuilderOptions;
    
    get text(): string;
    get names(): string[];
    get values(): any[];
    get parameters(): any[];

    append: SqlBuilderFunction;
    multiAppend<T>(array: T[], fn: (q: SqlBuilderFunction, it: T) => Sql, opts?: { join?: string }): Sql;

    toQuery(): { text: string; parameters: string[]; names: string[] };
}

export default function SqlBuilderFactory(options?: SqlBuilderOptions): SqlBuilderFunction;

export const pgsql: SqlBuilderFunction;
