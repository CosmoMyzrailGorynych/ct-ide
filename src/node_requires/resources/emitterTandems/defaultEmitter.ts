const emitter = {
    uid: 'default',
    texture: -1,
    openedTabs: ['texture'],
    textureBehavior: 'textureRandom',
    animatedSingleFramerate: 30,
    settings: {
        lifetime: {
            min: 0.5,
            max: 0.5
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0, // 0 means infinite emitting
        maxParticles: 1000,
        maxSpeed: 0,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,

        behaviors: [{
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
                    }]
                }
            }
        }, {
            type: 'color',
            config: {
                color: {
                    list: [{
                        value: 'ffffff',
                        time: 0
                    }, {
                        value: 'ffffff',
                        time: 0.5
                    }, {
                        value: 'ffffff',
                        time: 1
                    }]
                }
            }
        }, {
            type: 'blendMode',
            config: {
                blendMode: 'normal'
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
                    }]
                },
                minMult: 1
            }
        }, {
            type: 'moveSpeed',
            config: {
                speed: {
                    list: [{
                        value: 500,
                        time: 0
                    }, {
                        value: 100,
                        time: 1
                    }]
                },
                minMult: 1
            }
        }, {
            type: 'spawnShape',
            config: {
                type: 'torus',
                // eslint-disable-next-line id-blacklist
                data: {
                    innerRadius: 0,
                    radius: 64,
                    x: 0,
                    y: 0,
                    rotation: true
                }
            }
        }, {
            type: 'rotation',
            config: {
                minStart: 0,
                maxStart: 0,
                minSpeed: 0,
                maxSpeed: 0,
                accel: 0
            }
        }]
    }
} as ITandemEmitter;

export const get = (): ITandemEmitter => {
    const generateGUID = require('./../../generateGUID');
    const newEmitter = JSON.parse(JSON.stringify(emitter));
    newEmitter.uid = generateGUID();
    return newEmitter;
};
