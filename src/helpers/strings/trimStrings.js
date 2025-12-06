export function trimStrings(array) {
    return array.map(str => (typeof str === 'string' ? str.trim() : str));
}
