main-menu-meta
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{() => nw.Shell.openExternal('https://www.patreon.com/comigo')}")
            svg.feather
                use(xlink:href="data/icons.svg#heart")
            span {vocGlob.donate}
        li(onclick="{() => nw.Shell.openExternal('https://github.com/ct-js/ct-js')}")
            svg.feather
                use(xlink:href="data/icons.svg#code")
            span {vocGlob.contribute}
        li(onclick="{() => nw.Shell.openExternal('https://ctjs.rocks/')}")
            svg.feather
                use(xlink:href="data/icons.svg#globe-alt")
            span {vocGlob.ctsite}
        li(onclick="{() => nw.Shell.openExternal('https://discord.gg/3f7TsRC')}")
            svg.icon
                use(xlink:href="data/icons.svg#discord")
            span {voc.visitDiscordForGamedevSupport}
    ul.aMenu
        li(onclick="{showLicense}")
            svg.feather
                use(xlink:href="data/icons.svg#file-text")
            span {voc.license}
    ul.aMenu
        li(onclick="{showIconList}")
            svg.feather
                use(xlink:href="data/icons.svg#image")
            span {voc.openIconList}
    icon-panel(if="{iconsOpened}" data-hotkey-scope="icons" onclose="{closeIcons}")
    license-panel(if="{licenseOpened}" onclose="{hideLicense}")
    script.
        this.namespace = 'mainMenu.meta';
        this.mixin(window.riotVoc);

        this.iconsOpened = false;
        this.showLicense = false;

        this.showLicense = () => {
            this.licenseOpened = true;
            this.update();
        };
        this.hideLicense = () => {
            this.licenseOpened = false;
            this.update();
        };

        this.showIconList = () => {
            this.iconsOpened = true;
        };
        this.closeIcons = () => {
            this.iconsOpened = false;
            this.update();
        };
