const emitter = {
    uid: 'default',
    texture: -1,
    openedTabs: ['texture'],
    settings: {
        lifetime: {
            min: 0.5,
            max: 0.5
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        angleStart: 270,
        emitterLifetime: 0, // 0 means infinite emitting
        maxParticles: 1000,
        maxSpeed: 0,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        behaviors: [{
            type: 'moveSpeed',
            config: {
                speed: {
                    list: [{
                        value: 500,
                        time: 0
                    }, {
                        value: 100,
                        time: 1
                    }],
                    isStepped: false,
                    minMult: 1
                }
            }
        }, {
            type: 'alpha',
            config: {
                alpha: {
                    list: [{
                        value: 0,
                        time: 0
                    }, {
                        value: 1,
                        time: 0.5
                    }, {
                        value: 0,
                        time: 1
                    }],
                    isStepped: false
                }
            }
        }, {
            type: 'color',
            config: {
                list: [{
                    value: 'ffffff',
                    time: 0
                }, {
                    value: 'ffffff',
                    time: 0.5
                }, {
                    value: 'ffffff',
                    time: 1
                }],
                isStepped: false
            }
        }, {
            type: 'scale',
            config: {
                scale: {
                    list: [{
                        value: 1,
                        time: 0
                    }, {
                        value: 0.3,
                        time: 1
                    }],
                    isStepped: false
                }
            }
        }, {
            type: 'rotation',
            config: {
                minStart: 0,
                maxStart: 360,
                minSpeed: 0,
                maxSpeed: 0,
                accel: 0
            }
        }, {
            type: 'blendMode',
            config: {
                blendMode: 'NORMAL'
            }
        }, {
            type: 'spawnShape',
            config: {
                type: 'circle',
                // eslint-disable-next-line id-blacklist
                data: {
                    x: 0,
                    y: 0,
                    radius: 32
                }
            }
        }],
        delay: 0
    }
} as ITandemEmitter;

export const get = (): ITandemEmitter => {
    const generateGUID = require('./../../generateGUID');
    const newEmitter = JSON.parse(JSON.stringify(emitter));
    newEmitter.uid = generateGUID();
    return newEmitter;
};
