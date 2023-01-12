new-project-onboarding
    .aDimmer
    .aPanel.flexfix
        .flexfix-body
            .center
                svg.anIllustration
                    use(xlink:href="data/img/onboardingIllustration.svg#illustration")
                h1 {voc.hoorayHeader}
                p {voc.nowWhatParagraph}
            ul.aMenu
                li(onclick="{openDocs('/tutorials/making-games-shooter.html')}")
                    svg.feather
                        use(xlink:href="#space-shooter")
                    span {voc.openSpaceShooterTutorial}
                li(onclick="{openDocs('/tutorials/making-games-platformer.html')}")
                    svg.feather
                        use(xlink:href="#platformer")
                    span {voc.openPlatformerTutorial}
                li(onclick="{openDocs('/tutorials/making-games-jettycat.html')}")
                    svg.feather
                        use(xlink:href="#jettycat")
                    span {voc.openJettyCatTutorial}
                li(onclick="{close}")
                    svg.feather
                        use(xlink:href="#chevron-right")
                    span {voc.doNothing}
        .inset.flexfix-footer
            label.checkbox
                input(type="checkbox" onchange="{toggleOnboarding}" checked="{localStorage.showOnboarding !== 'off'}")
                span {voc.showOnboardingCheckbox}
    script.
        this.namespace = 'onboarding';
        this.mixin(window.riotVoc);

        this.close = () => {
            delete sessionStorage.showOnboarding;
            this.parent.update();
        };

        this.openDocs = link => () => {
            window.signals.trigger('openDocs', {
                path: link || '/'
            });
            this.close();
        };

        this.toggleOnboarding = () => {
            localStorage.showOnboarding = localStorage.showOnboarding !== 'off' ? 'off' : 'on';
        };
