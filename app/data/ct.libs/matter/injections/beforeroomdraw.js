if (this === ct.room) {
    if ([/*%matterUseStaticDeltaTime%*/][0] === false) {
        Matter.Engine.update(ct.room.matterEngine, 1000 / ct.speed * ct.delta);
    } else {
        Matter.Engine.update(ct.room.matterEngine, 1000 / ct.speed);
    }
}
