main-menu-troubleshooting
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{toggleDevTools}")
            svg.feather
                use(xlink:href="#terminal")
            span {voc.toggleDevTools}
        li(onclick="{copySystemInfo}")
            svg.feather
                use(xlink:href="#file-text")
            span {voc.copySystemInfo}
        li(onclick="{toggleBuiltInDebugger}")
            svg.feather
                use(xlink:href="#{localStorage.disableBuiltInDebugger === 'yes' ? 'check-square' : 'square'}")
            span {voc.disableBuiltInDebugger}
    ul.aMenu
        li(onclick="{() => nw.Shell.openExternal('https://github.com/ct-js/ct-js/issues/new/choose')}")
            svg.icon
                use(xlink:href="#github")
            span {voc.postAnIssue}
    script.
        this.namespace = 'mainMenu.troubleshooting';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.toggleDevTools = () => {
            const win = nw.Window.get();
            win.showDevTools();
        };

        this.toggleBuiltInDebugger = () => {
            if (localStorage.disableBuiltInDebugger === 'yes') {
                localStorage.disableBuiltInDebugger = 'no';
            } else {
                localStorage.disableBuiltInDebugger = 'yes';
            }
        };

        this.copySystemInfo = () => {
            const os = require('os'),
                  path = require('path');
            const packaged = path.basename(process.execPath, path.extname(process.execPath)) !== 'nw';
            const gl = document.createElement('canvas').getContext('webgl');
            var debugInfo, vendor, renderer;
            if (gl) {
                debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            const report = `Ct.js v${process.versions.ctjs} 😽 ${packaged ? '(packaged)' : '(runs from sources)'}\n\n` +
                  `NW.JS v${process.versions.nw}\n` +
                  `Chromium v${process.versions.chromium}\n` +
                  `Node.js v${process.versions.node}\n` +
                  `Pixi.js v${PIXI.VERSION}\n\n` +
                  `WebGL ${gl ? 'available' : 'UNAVAILABLE'}\n` +
                  `WebGL vendor ${(debugInfo && vendor) || 'UNKNOWN'}\n` +
                  `WebGL renderer ${(debugInfo && renderer) || 'UNKNOWN'}\n` +
                  `OS ${process.platform} ${process.arch} // ${os.type()} ${os.release()}`;
            nw.Clipboard.get().set(report, 'text');
            window.alertify.success(this.voc.systemInfoDone);
        };
