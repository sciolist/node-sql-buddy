
export class Sql {
    built = undefined;
    parts = [];
    options = {};

    get names() { return this.toQuery().names; }
    get text() { return this.toQuery().text; }
    get values() { return this.toQuery().parameters; }
    get parameters() { return this.toQuery().parameters; }

    constructor(options) {
        this.options = options ?? {};
    }

    append(text, parameters) {
        this.built = undefined;
    
        if (typeof text?.text === 'string') {
            parameters = text.parameters;
            text = text.text;
        }
    
        if(parameters && (parameters instanceof Array) && (parameters[0] instanceof Array) && parameters[0].length === 0) {
            throw new Error("Nested arrays cannot be used as sql parameter.");
        }
    
        this.parts.push([text, parameters]);
        return this;
    }

    toQuery() {
        if (this.built !== undefined) {
            return this.built;
        }

        let argCount = 0;
        const prefix = this.options.parameterNamePrefix;
        const sqlList = [];
        const argList = [];
        const argNameList = [];
        const outputArguments = new Map();
        for(let i=0; i<this.parts.length; ++i) {
            let txt = this.parts[i][0];
            const args = this.parts[i][1] ?? [];
            txt = txt.replace(new RegExp('(?!\\\\)\\' + (prefix) + '(\\d+)', 'g'), (m, idx) => {
                let parameterName;
                const parameterValue = this.options.parameterValueFormat(args[Number(idx) - 1]);
                let savedIndex = outputArguments.get(parameterValue);
                if (savedIndex === undefined) {
                    argCount += 1;
                    savedIndex = argCount;
                    parameterName = this.options.parameterNameFormat(savedIndex, this.options);
                    argNameList.push(parameterName);
                    argList.push(parameterValue);
                    outputArguments.set(parameterValue, savedIndex);
                } else {
                    parameterName = this.options.parameterNameFormat(savedIndex, this.options);
                }
                return this.options.parameterNameFormat(savedIndex, this.options);
            });
            sqlList.push(txt);
        }
        this.built = {
            text: sqlList.join(' '),
            names: argNameList,
            parameters: argList
        };
        return this.built;
    }
}

export default function SqlBuilderFactory(options) {
	const opts = Object.assign({
		parameterNamePrefix: '$',
		parameterNameFormat(name, opts) { return opts.parameterNamePrefix + name; },
		parameterValueFormat(value) { return value; }
	}, options);

	function builder(text, parameters) {
		let sql = new Sql(opts);
        if (!arguments.length) return sql;
        return sql.append(text, parameters);
	}

	return builder;
}

export function escape(v, quote) {
    if(!quote) quote = "'";
    return ((v||'').toString().replace(RegExp('[' + quote + ']', 'g'), function(m) { return m + m }));
}
