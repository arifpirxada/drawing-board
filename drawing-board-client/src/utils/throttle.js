export function throttle(func, delay) {
    let timeoutFlag = null;

    return (...args) => {
        if (timeoutFlag === null) {
            func(...args);
            timeoutFlag = setTimeout(() => {
                timeoutFlag = null;
            }, delay);
        }
    };
}