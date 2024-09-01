export type SqlBuilderOptions = {
    parameterNamePrefix?: string;
    parameterNameFormat?(name: string, opts: SqlBuilderOptions): string;
    parameterValueFormat?(value: any, opts: SqlBuilderOptions): any;
};

interface Queryable {
    text: string;
    values: any[];
}

export class Sql {
    built: undefined | { text: string; parameters: any[]; names: string[]; }
    parts: Array<[string[], any[]]>;
    options: SqlBuilderOptions;
    
    get text(): string;
    get names(): string[];
    get values(): any[];
    get parameters(): any[];

    append(text: string, parameters: any[]): Sql;
    append(sql: Queryable): Sql;

    toQuery(): { text: string; parameters: string[]; names: string[] };
}

type SqlBuilderFunction = (() => Sql) | ((text: string, parameters: any[]) => Sql) | ((sql: Queryable) => Sql);

export default function SqlBuilderFactory(options?: SqlBuilderOptions): SqlBuilderFunction;

export function escape(v: string, quote?: string): string;
