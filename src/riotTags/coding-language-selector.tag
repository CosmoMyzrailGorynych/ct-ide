coding-language-selector
    .aDimmer.fadein
        .aModal.flexfix.appear
            .flexfix-body.pad
                h1.nmt.npt {voc.chooseLanguageHeader}
                p {voc.chooseLanguageExplanation}
                .flexrow
                    .fifty.npl
                        h2.nmt
                            svg.icon
                                use(xlink:href="#coffeescript")
                            span CoffeeScript
                        p {voc.coffeeScriptDescription}
                        pre
                            code.
                                if health <= 0 and not invulnerable
                                    @kill = yes
                        button(class="{active: selection === 'coffeescript'}" onclick="{selectLanguage('coffeescript')}")
                            svg.icon
                                use(xlink:href="#coffeescript")
                            span {voc.pickCoffeeScript}
                    .fifty.npr
                        h2.nmt
                            svg.icon
                                use(xlink:href="#javascript")
                            span {voc.jsAndTs}
                        p {voc.jsTsDescription}
                        pre
                            code.
                                if (health <= 0 && !invulnerable) \{
                                    this.kill = true;
                                }
                        button(class="{active: selection === 'typescript'}" onclick="{selectLanguage('typescript')}")
                            svg.icon
                                use(xlink:href="#javascript")
                            span {voc.pickJsTs}
            .inset.flexfix-footer.flexrow
                button.nogrow(onclick="{cancel}")
                    span {vocGlob.cancel}
                .aSpacer
                button.nogrow(disabled="{!selection}" onclick="{applySelection}")
                    svg.feather
                        use(xlink:href="#check")
                    span {voc.acceptAndSpecifyDirectory}
    script.
        this.namespace = 'languageSelector';
        this.mixin(window.riotVoc);

        this.selection = false;

        this.selectLanguage = language => () => {
            this.selection = language;
        };

        this.cancel = () => {
            this.opts.oncancelled();
        };
        this.applySelection = () => {
            this.opts.onselected(this.selection);
        };
