type methodCall = (payload: unknown) => unknown;
const methodsMap = new Map<string, methodCall>();

export const registerMethod = (name: string, method: methodCall) => {
    methodsMap.set(name, method);
};
export const registerMethodMap = (methods:
    Record<string, methodCall> |
    Map<string, methodCall>) => {
    if (methods instanceof Map) {
        for (const [name, method] of methods) {
            registerMethod(name, method);
        }
    } else {
        for (const name in methods) {
            registerMethod(name, methods[name]);
        }
    }
};
export const callMethod = (name: string, payload: unknown) => {
    const method = methodsMap.get(name);
    if (method) {
        return method(payload);
    }
    throw new Error(`Method "${name}" not found`);
};
