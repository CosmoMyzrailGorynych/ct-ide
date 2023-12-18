const generateGUID = require('./../../generateGUID');

const defaultBehavior = {
    type: 'behavior' as const,
    name: 'NewBehavior'
};

export const get = function get(type: BehaviorType): IBehavior {
    return ({
        ...defaultBehavior,
        behaviorType: type,
        events: [],
        specification: [] as UserDefinedField[],
        lastmod: Number(new Date()),
        uid: generateGUID()
    });
};
