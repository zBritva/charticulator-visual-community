export function deepClone(object: object) {
    if (object) {
        return JSON.parse(JSON.stringify(object));
    } else {
        return null;
    }
}
