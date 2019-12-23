debugger-bottom-panel
    button(onclick="{reloadGame}")
        span {voc.reload}
    button(onclick="{reloadRoom}")
        span {voc.roomRestart}
    button.nogrow(onclick="{showModal}" title="{voc.getQR}")
        svg.feather
            use(xlink:href="data/icons.svg#smartphone")
    button.nogrow(onclick="{openExternal}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="data/icons.svg#external-link")
    button.nogrow(onclick="{flipLayout}" title="{voc.flipLayout}")
        svg.feather
            use(xlink:href="data/icons.svg#layout-{parent.verticalLayout? 'horizontal' : 'vertical'}")
    debugger-modal(if="{bShowModal}")
    script.
        this.namespace = 'preview';
        this.mixin(window.riotVoc);
        this.bShowModal = false;
        this.reloadGame = e => {
            const frame = document.querySelector('#thePreview');
            frame.executeJavaScript(`
                window.location.reload();
                window.focus();
            `);
        };
        this.reloadRoom = e => {
            const frame = document.querySelector('#thePreview');
            frame.executeJavaScript(`
                ct.rooms.switch(ct.room.name);
            `);
        };
        this.openExternal = e => {
            var game = document.getElementById('thePreview');
            const {shell} = require('electron');
            shell.openExternal(game.getURL());
        };
        this.showModal = e => {
            this.bShowModal = !this.bShowModal;
        };
        this.flipLayout = e => {
            this.parent.verticalLayout = !this.parent.verticalLayout;
            localStorage.debuggerLayour = this.parent.verticalLayout? 'vertical' : 'horizontal';
            this.parent.update();
        };