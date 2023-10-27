window.matter = {
    on(event, callback) {
        Matter.Events.on(ct.room.matterEngine, event, callback);
    },
    off(event, callback) {
        Matter.Events.off(ct.room.matterEngine, event, callback);
    },

    teleport(copy, x, y) {
        Matter.Body.setPosition(copy.matterBody, {
            x,
            y
        });
        copy.x = x;
        copy.y = y;
    },
    push(copy, forceX, forceY, fromX, fromY) {
        if (fromX === void 0) {
            Matter.Body.applyForce(copy.matterBody, copy.matterBody.position, {
                x: forceX,
                y: forceY
            });
        } else {
            Matter.Body.applyForce(copy.matterBody, {
                x: fromX,
                y: fromY
            }, {
                x: forceX,
                y: forceY
            });
        }
    },
    spin(copy, speed) {
        Matter.Body.setAngularVelocity(copy.matterBody, ct.u.degToRad(speed));
    },
    rotate(copy, angle) {
        Matter.Body.setAngle(copy.matterBody, ct.u.degToRad(angle));
    },
    rotateBy(copy, angle) {
        Matter.Body.rotate(copy.matterBody, ct.u.degToRad(angle));
    },
    scale(copy, x, y) {
        Matter.Body.scale(copy, x, y);
        copy.scale.x = x;
        copy.scale.y = y;
    },
    launch(copy, hspeed, vspeed) {
        Matter.Body.setVelocity(copy.matterBody, {
            x: hspeed,
            y: vspeed
        });
    },

    pin(copy) {
        const constraint = Matter.Constraint.create({
            bodyB: copy.matterBody,
            pointA: {
                x: copy.x,
                y: copy.y
            },
            length: 0
        });
        Matter.World.add(ct.room.matterWorld, constraint);
        return constraint;
    },
    tie(copy, position, stiffness = 0.05, damping = 0.05) {
        const constraint = Matter.Constraint.create({
            bodyB: copy.matterBody,
            pointA: position,
            pointB: {
                x: 0,
                y: 0
            },
            stiffness,
            damping
        });
        Matter.World.add(ct.room.matterWorld, constraint);
        return constraint;
    },
    rope(copy, length, stiffness = 0.05, damping = 0.05) {
        const constraint = Matter.Constraint.create({
            pointA: copy.position,
            bodyB: copy.matterBody,
            length,
            stiffness,
            damping
        });
        Matter.World.add(ct.room.matterWorld, constraint);
        return constraint;
    },
    tieTogether(copy1, copy2, stiffness, damping) {
        const constraint = Matter.Constraint.create({
            bodyA: copy1.matterBody,
            bodyB: copy2.matterBody,
            stiffness,
            damping
        });
        Matter.World.add(ct.room.matterWorld, constraint);
        return constraint;
    },
    onCreate(copy) {
        const options = {
            isStatic: copy.matterStatic,
            isSensor: copy.matterSensor,
            restitution: copy.matterRestitution || 0.1,
            friction: copy.matterFriction === void 0 ? 1 : copy.matterFriction,
            frictionStatic: copy.matterFrictionStatic === void 0 ? 0.1 : copy.matterFrictionStatic,
            frictionAir: copy.matterFrictionAir || 0.01,
            density: copy.matterDensity || 0.001
        };
        if (copy.shape.type === 'rect') {
            copy.matterBody = Matter.Bodies.rectangle(
                copy.x - copy.shape.left,
                copy.y - copy.shape.top,
                copy.shape.left + copy.shape.right,
                copy.shape.top + copy.shape.bottom,
                options
            );
        }
        if (copy.shape.type === 'circle') {
            copy.matterBody = Matter.Bodies.circle(
                copy.x,
                copy.y,
                copy.shape.r,
                options
            );
        }
        if (copy.shape.type === 'strip') {
            const vertices = Matter.Vertices.create(copy.shape.points);
            copy.matterBody = Matter.Bodies.fromVertices(copy.x, copy.y, vertices, options);
        }

        Matter.Body.setCentre(copy.matterBody, {
            x: (copy.texture.defaultAnchor.x - 0.5) * copy.texture.width,
            y: (copy.texture.defaultAnchor.y - 0.5) * copy.texture.height
        }, true);
        Matter.Body.setPosition(copy.matterBody, copy.position);
        Matter.Body.setAngle(copy.matterBody, ct.u.degToRad(copy.angle));
        Matter.Body.scale(copy.matterBody, copy.scale.x, copy.scale.y);

        Matter.World.add(ct.room.matterWorld, copy.matterBody);
        copy.matterBody.copy = copy;

        if (copy.matterFixPivot && copy.matterFixPivot[0]) {
            [copy.pivot.x] = copy.matterFixPivot;
        }
        if (copy.matterFixPivot && copy.matterFixPivot[1]) {
            [, copy.pivot.y] = copy.matterFixPivot;
        }

        if (copy.matterConstraint === 'pinpoint') {
            copy.constraint = window.matter.pin(copy);
        } else if (copy.matterConstraint === 'rope') {
            copy.constraint = window.matter.rope(
                copy,
                copy.matterRopeLength === 0 ? 64 : copy.matterRopeLength,
                copy.matterRopeStiffness === 0 ? 0.05 : copy.matterRopeStiffness,
                copy.matterRopeDamping === 0 ? 0.05 : copy.matterRopeDamping
            );
        }
    },
    createStaticTilemap(tilemap) {
        const options = {
            isStatic: true,
            isSensor: false,
            restitution: tilemap.matterRestitution || 0.1,
            friction: tilemap.matterFriction === void 0 ? 1 : tilemap.matterFriction
        };
        for (const tile of tilemap.tiles) {
            window.matter.createStaticTile(tile, options);
        }
    },
    createStaticTile(tile, options) {
        const {shape} = tile.sprite;
        if (shape.type === 'rect') {
            tile.matterBody = Matter.Bodies.rectangle(
                tile.x - shape.left,
                tile.y - shape.top,
                shape.left + shape.right,
                shape.top + shape.bottom,
                options
            );
        } else if (shape.type === 'circle') {
            tile.matterBody = Matter.Bodies.circle(
                tile.x,
                tile.y,
                shape.r,
                options
            );
        } else if (shape.type === 'strip') {
            const vertices = Matter.Vertices.create(shape.points);
            tile.matterBody = Matter.Bodies.fromVertices(tile.x, tile.y, vertices, options);
        }
        Matter.Body.setCentre(tile.matterBody, {
            x: (tile.sprite.texture.defaultAnchor.x - 0.5) * tile.sprite.texture.width,
            y: (tile.sprite.texture.defaultAnchor.y - 0.5) * tile.sprite.texture.height
        }, true);
        Matter.Body.setPosition(tile.matterBody, tile.sprite.position);
        Matter.World.add(ct.room.matterWorld, tile.matterBody);
    },
    getImpact(pair) {
        const {bodyA, bodyB} = pair;
        if (bodyA.isSensor || bodyB.isSensor) {
            return 0;
        }
        // Because static objects are Infinity-ly heavy, and Infinity * 0 returns NaN,
        // We should compute mass for static objects manually.
        const massA = bodyA.mass === Infinity ? 0 : bodyA.mass,
              massB = bodyB.mass === Infinity ? 0 : bodyB.mass;
        const impact = /*(bodyA.mass + bodyB.mass) */ ct.u.pdc(
            // This tells how much objects are moving in opposite directions
            bodyA.velocity.x * massA,
            bodyA.velocity.y * massA,
            bodyB.velocity.x * massB,
            bodyB.velocity.y * massB
        );
        return impact;
    },
    walkOverWithRulebook(rulebook, pairs) {
        if (!pairs.length || !rulebook.length) {
            return;
        }
        for (const pair of pairs) {
            const impact = window.matter.getImpact(pair);
            const bodies = [pair.bodyA, pair.bodyB];
            for (const body of bodies) {
                if (!body.copy) {
                    continue;
                }
                for (const rule of rulebook) {
                    if (body.copy.template === rule.mainTemplate) {
                        const otherBody = pair.bodyA === body ? pair.bodyB : pair.bodyA;
                        // eslint-disable-next-line max-depth
                        if (rule.any ||
                            (otherBody.copy && rule.otherTemplate === otherBody.copy.template)) {
                            rule.func.apply(body.copy, [otherBody.copy || otherBody.tile, impact]);
                        }
                    }
                }
            }
        }
    },
    rulebookStart: [],
    rulebookActive: [],
    rulebookEnd: []
};
