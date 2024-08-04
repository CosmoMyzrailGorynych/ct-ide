main-menu-troubleshooting
    h1 {voc.heading}
    ul.aMenu
        //- @see https://github.com/neutralinojs/neutralinojs/issues/1184
        //- li(onclick="{toggleDevTools}")
        //-     svg.feather
        //-         use(xlink:href="#terminal")
        //-     span {voc.toggleDevTools}
        li(onclick="{copySystemInfo}")
            svg.feather
                use(xlink:href="#file-text")
            span {voc.copySystemInfo}
    ul.aMenu
        li(onclick="{() => openLink('https://github.com/ct-js/ct-js/issues/new/choose')}")
            svg.icon
                use(xlink:href="#github")
            span {voc.postAnIssue}
    script.
        this.namespace = 'mainMenu.troubleshooting';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const fs = require('src/lib/neutralino-fs-extra');
        const {os} = Neutralino;
        this.openLink = link => os.open(link);

        this.toggleDevTools = () => {
            // TODO: implement when https://github.com/neutralinojs/neutralinojs/issues/1184 resolves
        };

        this.copySystemInfo = async () => {
            const PIXI = require('pixi.js');
            const {computer, clipboard} = Neutralino;
            const packaged = NL_RESMODE === 'bundle';
            const gl = document.createElement('canvas').getContext('webgl');
            let debugInfo, vendor, renderer;
            if (gl) {
                debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            const [memory, os, arch] = await Promise.all(
                computer.getMemoryInfo(),
                computer.getOSInfo()
            );
            const report = `Ct.js v${window.ctjsVersion} 😽 ${packaged ? '(packaged)' : '(runs from sources)'}\n\n` +
                  `Neutralino.js — v${NL_CVERSION} client, v${NL_VERSION} framework\n` +
                  `User agent ${navigator.userAgent}\n` +
                  `Pixi.js v${PIXI.VERSION}\n\n` +
                  // `WebGPU ${navigator.gpu ? 'available' : 'UNAVAILABLE'}\n` +
                  `WebGL ${gl ? 'available' : 'UNAVAILABLE'}\n` +
                  `WebGL vendor ${(debugInfo && vendor) || 'UNKNOWN'}\n` +
                  `WebGL renderer ${(debugInfo && renderer) || 'UNKNOWN'}\n` +
                  `OS ${NL_OS} ${NL_ARCH} // ${os.name} ${os.version}\n` +
                  `RAM ${(memory.virtual.total / 1024 / 1024).toFixed(1)}gb (${(memory.physical.total / 1024 / 1024).toFixed(1)})gb`;
            await clipboard.writeText(report);
            window.alertify.success(this.voc.systemInfoDone);
        };
