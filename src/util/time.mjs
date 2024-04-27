// time.mjs
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCurrentTimestamp() {
    const date = new Date();
    return date.toLocaleString(); // Returns the date and time in local format
}