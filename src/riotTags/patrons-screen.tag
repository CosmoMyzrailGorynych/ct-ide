patron-line
    .aPatronEmoji {parent.getEmoji(opts.patron.name)}
    b {opts.patron.name}
    |
    |
    span {parent.getFiller(opts.patron.name)}

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
        patron-line(each="{patron in patrons.partner}" patron="{patron}")
        p(if="{!patrons.partner.length}") {voc.noSponsorsYet}

        h2
            img(src="/data/img/boostyTiers_businessCat.png")
            |
            | {voc.businessCats}
        patron-line(each="{patron in patrons['business cat']}" patron="{patron}")

        h2
            img(src="/data/img/boostyTiers_ct.png")
            |
            | {voc.cats}
        patron-line(each="{patron in patrons.cat}" patron="{patron}")

    script.
        this.namespace = 'patreon';
        this.mixin(require('src/node_requires/riotMixins/voc').default);
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

        const {patrons, donors, getPatrons} = require('src/node_requires/patrons');
        getPatrons().then(() => {
            this.patrons = patrons;
            this.donors = donors;
            this.loading = false;
            this.update();
        });

        this.openBoosty = () => {
            const {os} = Neutralino;
            os.open('https://boosty.to/comigo');
        };
