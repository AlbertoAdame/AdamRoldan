export interface Request {
    idRequest: number;
    address: string;
    date: number[];
    totalPrice: number;
    iva: number;
    username: Username;
    beatList: BeatList[];
}

export interface BeatList {
    idBeat: number;
    title: string;
    price: number;
    time: number;
    bpm: number;
    img: string;
    audio: string;
    date: number[];
    genreList: GenreList[];
    mood: MoodClass | string;
}

export interface GenreList {
    idBeat: number;
    genre: GenreClass | string;
}

export interface GenreClass {
    genre: string;
}

export interface MoodClass {
    mood: string;
}

export interface Username {
    username: string;
    password: string;
    name: string;
    email: string;
    role: string;
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}

export interface Authority {
    authority: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRequest(json: string): Request[] {
        return cast(JSON.parse(json), a(r("Request")));
    }

    public static requestToJson(value: Request[]): string {
        return JSON.stringify(uncast(value, a(r("Request"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Request": o([
        { json: "idRequest", js: "idRequest", typ: 0 },
        { json: "address", js: "address", typ: "" },
        { json: "date", js: "date", typ: a(0) },
        { json: "totalPrice", js: "totalPrice", typ: 3.14 },
        { json: "iva", js: "iva", typ: 0 },
        { json: "username", js: "username", typ: r("Username") },
        { json: "beatList", js: "beatList", typ: a(r("BeatList")) },
    ], false),
    "BeatList": o([
        { json: "idBeat", js: "idBeat", typ: 0 },
        { json: "title", js: "title", typ: "" },
        { json: "price", js: "price", typ: 3.14 },
        { json: "time", js: "time", typ: 0 },
        { json: "bpm", js: "bpm", typ: 0 },
        { json: "img", js: "img", typ: "" },
        { json: "audio", js: "audio", typ: "" },
        { json: "date", js: "date", typ: a(0) },
        { json: "genreList", js: "genreList", typ: a(r("GenreList")) },
        { json: "mood", js: "mood", typ: u(r("MoodClass"), "") },
    ], false),
    "GenreList": o([
        { json: "idBeat", js: "idBeat", typ: 0 },
        { json: "genre", js: "genre", typ: u(r("GenreClass"), "") },
    ], false),
    "GenreClass": o([
        { json: "genre", js: "genre", typ: "" },
    ], false),
    "MoodClass": o([
        { json: "mood", js: "mood", typ: "" },
    ], false),
    "Username": o([
        { json: "username", js: "username", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "role", js: "role", typ: "" },
        { json: "enabled", js: "enabled", typ: true },
        { json: "authorities", js: "authorities", typ: a(r("Authority")) },
        { json: "accountNonExpired", js: "accountNonExpired", typ: true },
        { json: "accountNonLocked", js: "accountNonLocked", typ: true },
        { json: "credentialsNonExpired", js: "credentialsNonExpired", typ: true },
    ], false),
    "Authority": o([
        { json: "authority", js: "authority", typ: "" },
    ], false),
};
