import { flattenObject } from "./flatten.js";

export function mergeFlattenedSchemas(users) {
    const schema = {};

    for (const user of users) {
        const flat = flattenObject(user);
        for (const [key, value] of Object.entries(flat)) {
            if (!(key in schema)) {
                schema[key] = value;
            }
        }
    }

    return schema;
}
