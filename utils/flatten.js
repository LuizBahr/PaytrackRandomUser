export function flattenObject(obj, parentKey = "", result = {}) {
    for (const key in obj) {
        const newKey = parentKey ? `${parentKey}_${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}
