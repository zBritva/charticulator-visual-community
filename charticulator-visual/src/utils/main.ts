export function deepClone(object: object) {
    if (object) {
        return JSON.parse(JSON.stringify(object))
    } else {
        return null
    }
}

export function isEditor() {
    const hostElement = document.getElementById('sandbox-host')
    return hostElement.className.includes('EDITOR')
}