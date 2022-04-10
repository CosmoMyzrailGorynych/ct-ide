const emitter = {
    texture: -1,
    openedTabs: ['texture'],
    settings: {
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
        },
        scale: {
            list: [{
                value: 1,
                time: 0
            }, {
                value: 0.3,
                time: 1
            }],
            isStepped: false
        },
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
            }],
            isStepped: false
        },
        blendMode: 'normal',
        speed: {
            list: [{
                value: 500,
                time: 0
            }, {
                value: 100,
                time: 1
            }],
            isStepped: false
        },
        startRotation: {
            min: 0,
            max: 360
        },
        rotationSpeed: {
            min: 0,
            max: 0
        },
        rotationAcceleration: 0,
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
        acceleration: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: {
            x: 0,
            y: 0,
            r: 32
        },
        delay: 0
    }
} as ITandemEmitter;

module.exports = {
    get(): ITandemEmitter {
        const generateGUID = require('./../../generateGUID');
        const newEmitter = JSON.parse(JSON.stringify(emitter));
        newEmitter.uid = generateGUID();
        return newEmitter;
    }
};
