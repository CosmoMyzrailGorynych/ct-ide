if (this === rooms.current) {
    if ([/*%matterUseStaticDeltaTime%*/][0] === false) {
        Matter.Engine.update(rooms.current.matterEngine, 1000 / settings.speed * u.delta);
    } else {
        Matter.Engine.update(rooms.current.matterEngine, 1000 / settings.speed);
    }
}
