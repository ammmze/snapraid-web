type Data = {
    name: string;
    mountPath: string;
}

type Config = {
    parity1: string;
    parity2?: string;
    parity3?: string;
    parity4?: string;
    parity5?: string;
    parity6?: string;
    content: string[];
    data: Data[];
    excludeHidden?: boolean;
    excludePaths?: string[];
    includePaths?: string[];
    blockSize?: number;
    autoSaveSize?: number;
    pool?: string;
}


// TODO: nohidden, blocksize, autosave, pool, smartctl
const propertyMap = [
    { property: 'parity', key: 'parity1' },
    { property: '2-parity', key: 'parity2' },
    { property: '3-parity', key: 'parity3' },
    { property: '4-parity', key: 'parity4' },
    { property: '5-parity', key: 'parity5' },
    { property: '6-parity', key: 'parity6' },
    { property: 'content', type: 'array' },
    { property: 'exclude', key: 'excludePaths', type: 'array' },
    { property: 'include', key: 'includePaths', type: 'array' },
    {
        property: 'data', type: 'array', deserialize: value => {
            const [match, name, mountPath] = value.match(/^([^\s]+)[\s]+(.*)$/);
            return { name, mountPath };
        }
    },
];

function addLineToConfig(line: string, cfg: Config) {
    const [match, property, value] = line.match(/^([^\s]+)\s*(.*)?$/)

    if (!match) return;

    const { key = property, type, deserialize = value => value } = propertyMap.find(map => map.property === property) || {};

    if (type === 'array') {
        cfg[key] = [...cfg[key] || [], deserialize(value)];
    } else {
        cfg[key] = deserialize(value);
    }
}

export function parse(config: string): Config {
    const cfg: Config = {
        parity1: '',
        content: [],
        data: []
    };
    config.split('\n')
        // trim whitespace
        .map(line => line.trim())
        // filter empty and comment lines
        .filter(line => line.length > 0 && !line.match(/^#/))
        .forEach(line => {
            addLineToConfig(line, cfg)
        });
    return cfg;
}

export function toString(config: Config): string {
    return '';
}