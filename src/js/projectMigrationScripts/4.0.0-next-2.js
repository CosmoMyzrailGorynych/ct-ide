window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-2',
    // eslint-disable-next-line max-lines-per-function, complexity
    process: project => new Promise(resolve => {
        // pixi-particles -> @pixi/particle-emitter migration
        for (const tandem of project.emitterTandems) {
            if (!tandem.emitters[0].settings.acceleration) {
                continue; // skip already converted or empty tandems
            }
            delete tandem.previewTexture;
            delete tandem.origname;
            tandem.lastmod = Number(new Date());
            for (let i = 0; i < tandem.emitters.length; i++) {
                const v2Emitter = tandem.emitters[i],
                      v2Settings = v2Emitter.settings;
                const usesAcceleration = v2Settings.acceleration.x !== 0 ||
                                         v2Settings.acceleration.y !== 0;
                const v2Shape = v2Settings.spawnType;
                let shapeConfig, shapeType;
                switch (v2Shape) {
                default:
                case 'point':
                    shapeType = 'spawnShape';
                    shapeConfig = {
                        type: 'torus',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            innerRadius: 0,
                            radius: 0,
                            x: 0,
                            y: 0,
                            rotation: Boolean(!v2Settings.noRotation)
                        }
                    };
                    break;
                case 'circle':
                case 'ring':
                    shapeType = 'spawnShape';
                    shapeConfig = {
                        type: 'torus',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            innerRadius: v2Shape === 'circle' ? 0 : v2Settings.spawnCircle.minR,
                            radius: v2Settings.spawnCircle.r,
                            x: 0,
                            y: 0,
                            rotation: Boolean(!v2Settings.noRotation)
                        }
                    };
                    break;
                case 'rect':
                    shapeType = 'spawnShape';
                    shapeConfig = {
                        type: 'rect',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            x: 0,
                            y: 0,
                            width: v2Settings.spawnRect.w,
                            height: v2Settings.spawnRect.h
                        }
                    };
                    break;
                case 'burst':
                    shapeType = 'spawnBurst';
                    shapeConfig = {
                        type: 'torus',
                        // eslint-disable-next-line id-blacklist
                        data: {
                            innerRadius: 0,
                            radius: 0,
                            x: 0,
                            y: 0,
                            rotation: Boolean(!v2Settings.noRotation)
                        }
                    };
                    break;
                }
                const v3Emitter = {
                    uid: v2Emitter.uid,
                    texture: v2Emitter.texture,
                    openedTabs: v2Emitter.openedTabs,
                    textureBehavior: 'textureRandom',
                    animatedSingleFramerate: 10,
                    settings: {
                        frequency: v2Settings.frequency,
                        lifetime: v2Settings.lifetime,
                        spawnChance: v2Settings.spawnChance,
                        emitterLifetime: v2Settings.emitterLifetime,
                        maxParticles: v2Settings.maxParticles,
                        addAtBack: v2Settings.addAtBack,
                        particlesPerWave: v2Settings.particlesPerWave ?? 1,
                        pos: {
                            x: v2Settings.pos.x,
                            y: v2Settings.pos.y
                        },
                        behaviors: [{ // 0
                            type: 'alpha',
                            config: {
                                alpha: {
                                    list: v2Settings.alpha.list,
                                    isStepped: v2Settings.alpha.isStepped
                                }
                            }
                        },
                        { // 1
                            type: 'color',
                            config: {
                                color: {
                                    list: v2Settings.color.list,
                                    isStepped: v2Settings.color.isStepped
                                }
                            }
                        },
                        { // 2
                            type: 'blendMode',
                            config: {
                                blendMode: v2Settings.blendMode
                            }
                        },
                        { // 3
                            type: 'scale',
                            config: {
                                scale: {
                                    list: v2Settings.scale.list,
                                    isStepped: v2Settings.scale.isStepped
                                },
                                minMult: v2Settings.minimumScaleMultiplier
                            }
                        },
                        { // 4
                            type: usesAcceleration ? 'moveAcceleration' : 'moveSpeed',
                            config: usesAcceleration ?
                                {
                                    minStart: v2Settings.speed.list[0].value *
                                             (v2Settings.minimumSpeedMultiplier ?? 1),
                                    maxStart: v2Settings.speed.list[0].value,
                                    accel: {
                                        x: v2Settings.acceleration.x,
                                        y: v2Settings.acceleration.y
                                    },
                                    rotate: Boolean(!v2Settings.noRotation),
                                    maxSpeed: v2Settings.maxSpeed
                                } :
                                {
                                    speed: {
                                        list: v2Settings.speed.list,
                                        isStepped: v2Settings.speed.isStepped
                                    },
                                    minMult: v2Settings.minimumSpeedMultiplier ?? 1
                                }
                        },
                        { // 5
                            type: shapeType,
                            config: shapeConfig
                        },
                        { // 6
                            type: 'rotation',
                            config: {
                                minStart: v2Settings.startRotation.min,
                                maxStart: v2Settings.startRotation.max,
                                minSpeed: v2Settings.rotationSpeed.min,
                                maxSpeed: v2Settings.rotationSpeed.max,
                                accel: v2Settings.rotationAcceleration
                            }
                        }]
                    }
                };
                tandem.emitters[i] = v3Emitter;
            }
        }

        // Unified asset folders
        const oldGroups = {};
        // Flatten old groups into one group map
        for (const key in project.groups) {
            for (const group of project.groups[key]) {
                if (!(group.name in oldGroups)) {
                    oldGroups[group.name] = group;
                }
            }
        }
        // Turn old groups into asset folders
        project.assets = project.assets ?? [];
        for (const key in oldGroups) {
            const group = oldGroups[key];
            group.entries = [];
            group.type = 'folder';
            project.assets.push(group);
        }
        const typeToCollectionMap = {
            template: 'templates',
            room: 'rooms',
            sound: 'sounds',
            style: 'styles',
            skeleton: 'skeletons',
            texture: 'textures',
            tandem: 'emitterTandems',
            font: 'fonts'
        };
        // Put assets into folders.
        // Ensure all of them have an asset type set in their object.
        for (const assetType in typeToCollectionMap) {
            const collectionName = typeToCollectionMap[assetType];
            for (const asset of project[collectionName]) {
                asset.type = assetType;
                if (asset.group) {
                    const groupName = project.groups[collectionName]
                        .find(g => g.uid === asset.group.uid).name;
                    oldGroups[groupName].entries.push(asset);
                } else {
                    project.assets.push(asset);
                }
            }
            delete project[collectionName];
        }
        delete project.groups;
        resolve();
    })
});
