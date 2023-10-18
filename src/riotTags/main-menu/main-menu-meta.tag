main-menu-meta
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{() => nw.Shell.openExternal('https://boosty.to/comigo')}")
            svg.feather
                use(xlink:href="#heart")
            span {vocGlob.donate}
        li(onclick="{() => nw.Shell.openExternal('https://github.com/ct-js/ct-js')}")
            svg.feather
                use(xlink:href="#code")
            span {vocGlob.contribute}
        li(onclick="{() => nw.Shell.openExternal('https://forum.ctjs.rocks/')}")
            svg.feather
                use(xlink:href="#message-circle")
            span {voc.ctjsForum}
        li(onclick="{() => nw.Shell.openExternal('https://ctjs.rocks/')}")
            svg.feather
                use(xlink:href="#globe-alt")
            span {vocGlob.ctSite}
        li(onclick="{() => nw.Shell.openExternal('https://discord.gg/3f7TsRC')}")
            svg.icon
                use(xlink:href="#discord")
            span {voc.visitDiscordForGamedevSupport}
        li(onclick="{() => nw.Shell.openExternal('https://twitter.com/ctjsrocks')}")
            svg.icon
                use(xlink:href="#twitter")
            span {voc.twitter}
        li(onclick="{() => nw.Shell.openExternal('https://vk.com/ctjsrocks')}")
            svg.icon
                use(xlink:href="#vk")
            span {voc.vkontakte}
    ul.aMenu
        li(onclick="{showLicense}")
            svg.feather
                use(xlink:href="#file-text")
            span {voc.license}
    ul.aMenu
        li(onclick="{showStylebook}")
            svg.feather
                use(xlink:href="#droplet")
            span {voc.openStylebook}
        li(onclick="{showIconList}")
            svg.feather
                use(xlink:href="#image")
            span {voc.openIconList}
    icon-panel(if="{iconsOpened}" data-hotkey-scope="icons" onclose="{closeIcons}")
    stylebook-panel(if="{stylebookOpened}" data-hotkey-scope="stylebook" onclose="{closeStylebook}")
    license-panel(if="{licenseOpened}" onclose="{hideLicense}")
    script.
        this.namespace = 'mainMenu.meta';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

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

        this.showStylebook = () => {
            this.stylebookOpened = true;
        };
        this.closeStylebook = () => {
            this.stylebookOpened = false;
            this.update();
        };
