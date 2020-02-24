debugger-toolbar
    .debugger-toolbar-aDragger.feather
        svg.feather
            use(xlink:href="data/icons.svg#dragger-vertical")

    .debugger-toolbar-aButton(onclick="{sendMessage('togglePause')}" title="{gamePaused? voc.resume : voc.pause}")
        svg.feather
            use(xlink:href="data/icons.svg#{gamePaused? 'play' : 'pause'}")
    .debugger-toolbar-aButton(onclick="{sendMessage('restartGame')}" title="{voc.restartGame}")
        svg.feather
            use(xlink:href="data/icons.svg#rotate-cw")
    .debugger-toolbar-aButton(onclick="{sendMessage('restartRoom')}" title="{voc.restartRoom}")
        svg.feather
            use(xlink:href="data/icons.svg#room-reload")
    .debugger-toolbar-aButton(onclick="{displayRoomSelector}" title="{voc.switchRoom}")
        svg.feather
            use(xlink:href="data/icons.svg#room-switch")

    .debugger-toolbar-aDivider

    .debugger-toolbar-aButton(onclick="{sendMessage('toggleDevTools')}" title="{voc.toggleDevTools}")
        svg.feather
            use(xlink:href="data/icons.svg#terminal")
    .debugger-toolbar-aButton(onclick="{sendMessage('makeScreenshot')}" title="{voc.screenshot}")
        svg.feather
            use(xlink:href="data/icons.svg#camera")
    .debugger-toolbar-aButton(onclick="{sendMessage('toggleFullscreen')}" title="{gameFullscreen? voc.exitFullscreen : voc.enterFullscreen}")
        svg.feather
            use(xlink:href="data/icons.svg#{gameFullscreen? 'minimize' : 'maximize'}-2")
    .debugger-toolbar-aButton(onclick="{sendMessage('openQrCodes')}" title="{voc.links}")
        svg.feather
            use(xlink:href="data/icons.svg#smartphone")
    .debugger-toolbar-aButton(onclick="{sendMessage('openExternal')}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="data/icons.svg#external-link")

    .debugger-toolbar-aDivider

    .debugger-toolbar-aButton(onclick="{sendMessage('closeDebugger')}" title="{voc.close}")
        svg.feather
            use(xlink:href="data/icons.svg#x")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(window.riotVoc);

        const params = new URLSearchParams(window.location.search),
              parentWindow = Number(params.get('parentId')),
              rooms = params.getAll('rooms');

        const {Menu} = require('electron').remote,
              menu = Menu.buildFromTemplate(rooms.map(room => ({
                  label: room,
                  click: () => {
                      this.switchRoom(room);
                  }
              })));
        this.sendMessage = message => e => {
            const {ipcRenderer} = require('electron');
            ipcRenderer.sendTo(parentWindow, 'debuggerToolbar', message);
            if (message === 'togglePause') {
                this.gamePaused = !this.gamePaused;
            }
            if (message === 'toggleFullscreen') {
                this.gameFullscreen = !this.gameFullscreen;
            }
        };
        this.switchRoom = room => {
            const {ipcRenderer} = require('electron');
            ipcRenderer.sendTo(parentWindow, 'debuggerToolbar', `switchRoom:${room}`);
        };
        this.displayRoomSelector = e => {
            menu.popup();
        };