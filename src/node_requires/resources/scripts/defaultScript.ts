import generateGUID from './../../generateGUID';

export const get = (): IScript => {
    const uid = generateGUID();
    return ({
        uid,
        name: 'New Script',
        code: '',
        language: window.currentProject.language || 'typescript',
        lastmod: Number(new Date()),
        runAutomatically: false,
        type: 'script' as const
    });
};
