import generateGUID from './../../generateGUID';

export const get = (): IScript => {
    const uid = generateGUID();
    return ({
        uid,
        name: 'New Script',
        code: window.currentProject.language === 'catnip' ? [] : '',
        language: window.currentProject.language || 'typescript',
        variables: [],
        runAutomatically: false,
        lastmod: Number(new Date()),
        type: 'script' as const
    });
};
