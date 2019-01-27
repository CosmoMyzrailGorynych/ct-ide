patreon-screen
    h1 {voc.patronsHeader}
    
    h2 {voc.aspiringAstronauts}
    
    p(each="{patron of patrons.astronauts}") {getEmoji()} {patron}
    
    p.aPatronThanks {voc.thankAllPatrons}

    button(onclick="{openPatreon}")
        i.icon-heart
        span  {voc.becomeAPatron}
    script.
        this.patrons = {
            astronauts: [

            ]
        };
        this.emojis = [
            '😊', '😋', '😍', '😘', '🥰', '😗', '😙', '😚',
            '🥳', '🤪', '🐱', '😻', ' 😽', '😸', '🎂', '🥂',
            '🌞', '🎊', '🎉'
        ];
        this.getEmoji = () => {
            return this.emojis[~~(Math.random() * this.emojis.length)];
        }