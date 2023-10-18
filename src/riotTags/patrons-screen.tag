patron-line
    .aPatronEmoji {parent.getEmoji(opts.patron)}
    b {opts.patron}
    |
    |
    span {parent.getFiller(opts.patron)}

patrons-screen.aView(style="z-index: 100;")
    .Confetti
        .aConfettiPiece(each="{confetti in (new Array(15))}" style="background: {getConfettiColor()}")
    aside
        p {voc.aboutPatrons}
        p.aPatronThanks {voc.thankAllPatrons}
        h3
            img(src="/data/img/boostyTiers_sponsor.png")
            |
            | {voc.sponsors}
        p {voc.sponsorsDescription}

        h3
            img(src="/data/img/boostyTiers_businessCat.png")
            |
            | {voc.businessCats}
        p {voc.businessCatsDescription}

        h3
            img(src="/data/img/boostyTiers_ct.png")
            |
            | {voc.cats}
        p {voc.catsDescription}

        button(onclick="{openBoosty}").nml
            svg.feather
                use(xlink:href="#heart")
            span  {voc.becomeAPatron}
    h1 {voc.patronsHeader}
    div(if="{loading}")
        svg.feather
            use(xlink:href="#loader")
        | {vocGlob.loading}
    div(if="{!loading}")
        h2
            img(src="/data/img/boostyTiers_sponsor.png")
            |
            | {voc.sponsors}
        patron-line(each="{patron in patrons.sponsors}" patron="{patron}")
        p(if="{!patrons.sponsors.length}") {voc.noSponsorsYet}

        h2
            img(src="/data/img/boostyTiers_businessCat.png")
            |
            | {voc.businessCats}
        patron-line(each="{patron in patrons.businessCats}" patron="{patron}")

        h2
            img(src="/data/img/boostyTiers_ct.png")
            |
            | {voc.cats}
        patron-line(each="{patron in patrons.cats}" patron="{patron}")

    script.
        this.namespace = 'patreon';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
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

        this.importPatronData = async () => {
            const fs = require('fs-extra');
            const YAML = require('js-yaml');
            const raw = await fs.readFile('./data/boosters.yaml', 'utf8');
            const patronsYaml = YAML.load(raw);

            this.patrons = patronsYaml;
            this.loading = false;
            this.update();
        };
        this.importPatronData();

        this.openBoosty = () => {
            nw.Shell.openExternal('https://boosty.to/comigo');
        };
