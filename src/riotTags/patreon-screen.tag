patron-line
    img(src="{patron.avatar}")
    b {opts.patron.name}
    |
    |
    span(if="{!opts.patron.about}") {parent.getFiller(opts.patron.name)}
    a(href="{opts.patron.link}" if="{opts.patron.about}")
        | {opts.patron.about}
        |
        |
        span(if="{opts.patron['18+']}") 🔞
    span(if="{!opts.patron['18+'] && opts.patron.about}") {parent.getEmoji(opts.patron.name)}
    script.

patreon-screen.view(style="z-index: 100;")
    .Confetti
        .aConfettiPiece(each="{confetti in (new Array(15))}" style="background: {getConfettiColor()}")
    h1 {voc.patronsHeader}
    p {voc.aboutPatrons}
    div(if="{loading}")
        svg.feather
            use(xlink:href="data/icons.svg#loader")
        | {vocGlob.loading}
    div(if="{!loading}")
        h2 {voc.businessShuttles}

        patron-line(each="{patron in patrons.shuttles}" patron="{patron}")

        p
            span(if="{!patrons.shuttles.length}") {voc.noShuttlesYet}
            |
            |
            | {voc.shuttlesDescription}

        h2 {voc.spacePirates}

        patron-line(each="{patron in patrons.pirates}" patron="{patron}")

        p
            span(if="{!patrons.pirates.length}") {noPiratesYet}
            |
            |
            | {voc.piratesDescription}

        h2 {voc.spaceProgrammers}

        patron-line(each="{patron in patrons.programmers}" patron="{patron}")

        p {voc.programmersDescription}

        h2 {voc.aspiringAstronauts}

        patron-line(each="{patron in patrons.astronauts}" patron="{patron}")

        p
            span(if="{!patrons.astronauts.length}") {noAstronautsYet}
            |
            |
            | {voc.astronautsDescription}

        p.aPatronThanks {voc.thankAllPatrons}

    button(onclick="{openPatreon}").nml
        svg.feather
            use(xlink:href="data/icons.svg#heart")
        span  {voc.becomeAPatron}
    script.
        this.namespace = 'patreon';
        this.mixin(window.riotVoc);
        this.loading = true;
        this.emojis = [
            '😊',
            '😋',
            '😍',
            '😘',
            '🥰',
            '😗',
            '😙',
            '😚',
            '🥳',
            '🤪',
            '🐱',
            '😻',
            '😽',
            '😸',
            '🎂',
            '🥂',
            '🌞',
            '🎊',
            '🎉'
        ];
        this.confettiColors = [
            '#ffd300',
            '#17d3ff',
            '#ff4e91'
        ];
        this.patrons = {
            shuttles: [],
            pirates: [],
            astronauts: [],
            programmers: []
        };
        const getMagicNumber = str =>
            str.split('')
            .map(char => char.codePointAt(0))
            .reduce((sum, x) => sum + x);
        this.getEmoji = str =>
            this.emojis[getMagicNumber(str) % this.emojis.length];
        this.getFiller = str =>
            this.voc.aboutFillers[getMagicNumber(str) % this.voc.aboutFillers.length];
        this.getConfettiColor = () =>
            this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];

        this.importPatronData = text => {
            const patrons = [];
            var table = text.split('\r\n').map(row => row.split(','));
            for (let i = 1, l = table.length; i < l; i++) {
                const obj = {},
                      row = table[i];
                for (let j = 0; j < row.length; j++) {
                    obj[table[0][j].trim()] = row[j];
                }
                const prev = patrons.find(patron => patron.name === obj.name);
                if (prev) {
                    patrons.splice(patrons.indexOf(prev), 1);
                }
                patrons.push(obj);
            }
            patrons.filter(patron => patron.tier);
            patrons.forEach(patron => {
                patron.former = Boolean(patron.former);
                if (patron.tier === 'An Aspiring Astronaut') {
                    this.patrons.astronauts.push(patron);
                } else if (patron.tier === 'A Space Pirate') {
                    this.patrons.pirates.push(patron);
                } else if (patron.tier === 'A Business Shuttle') {
                    this.patrons.shuttles.push(patron);
                } else if (patron.tier === 'A Space Programmer') {
                    this.patrons.programmers.push(patron);
                }
            });
            this.loading = false;
            this.update();
        };
        this.loadPatrons = () => {
            this.loading = true;
            window.fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTUMd6nvY0if8MuVDm5-zMfAxWCSWpUzOc81SehmBVZ6mytFkoB3y9i9WlUufhIMteMDc00O9EqifI3/pub?output=csv')
            .then(response => response.text())
            .then(this.importPatronData)
            .catch(e => {
                console.error(e);
                const fs = require('fs-extra');
                fs.readFile('./data/patronsCache.csv', {
                    encoding: 'utf8'
                })
                .then(this.importPatronData)
                .catch(e => {
                    console.error(e);
                });
            });
        };
        this.loadPatrons();

        this.openPatreon = () => {
            nw.Shell.openExternal('https://www.patreon.com/comigo');
        };