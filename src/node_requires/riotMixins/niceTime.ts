const niceTime = function (date: Date | string | number) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const today = new Date();
    if (date.getDate() !== today.getDate() ||
        date.getFullYear() !== today.getFullYear() ||
        date.getMonth() !== today.getMonth()
    ) {
        return date.toLocaleDateString();
    }
    return date.toLocaleTimeString();
};
export default {
    init(this: IRiotTag) {
        this.niceTime = niceTime;
    }
};
