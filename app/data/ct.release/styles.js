ct.styles = {
    types: { },
    new(name, data) {
        ct.styles.types[name] = data;
        return data;
    },
    get(name, copy) {
        if (copy === true) {
            return ct.u.ext({}, ct.styles.types[name]);
        }
        if (copy) {
            return ct.u.ext(ct.u.ext({}, ct.styles.types[name]), copy);
        }
        return ct.styles.types[name];
    }
};
/*@styles@*/
/*%styles%*/
