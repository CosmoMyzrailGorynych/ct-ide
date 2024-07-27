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
        li(onclick="{toggleBuiltInDebugger}")
            svg.feather
                use(xlink:href="#{localStorage.disableBuiltInDebugger === 'yes' ? 'check-square' : 'square'}")
            span {voc.disableBuiltInDebugger}
        li(onclick="{toggleVulkanSupport}" title="{voc.disableVulkanSDHint}")
            svg.feather
                use(xlink:href="#{packageJson['chromium-args'].indexOf('--disable-features=Vulkan') !== -1 ? 'check-square' : 'square'}")
            span {voc.disableVulkan}
            svg.feather.dim
                use(xlink:href="#steamdeck")
    ul.aMenu
        li(onclick="{() => openLink('https://github.com/ct-js/ct-js/issues/new/choose')}")
            svg.icon
                use(xlink:href="#github")
            span {voc.postAnIssue}
    script.
        this.namespace = 'mainMenu.troubleshooting';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        const fs = require('src/node_requires/neutralino-fs-extra');
        const {os} = require('@neutralinojs/lib');
        this.openLink = link => os.open(link);

        this.packageJson = require('app/package.json');
        this.toggleVulkanSupport = async () => {
            const pj = this.packageJson;
            if (pj['chromium-args'].indexOf('--disable-features=Vulkan') === -1) {
                pj['chromium-args'] += ' --disable-features=Vulkan';
            } else {
                pj['chromium-args'] = pj['chromium-args'].replace(' --disable-features=Vulkan', '');
            }
            await fs.outputJSON('./package.json', pj, {
                spaces: 2
            });
            alertify.success(this.voc.restartMessage);
        };

        this.toggleDevTools = () => {
            // TODO: implement when https://github.com/neutralinojs/neutralinojs/issues/1184 resolves
        };

        this.toggleBuiltInDebugger = () => {
            if (localStorage.disableBuiltInDebugger === 'yes') {
                localStorage.disableBuiltInDebugger = 'no';
            } else {
                localStorage.disableBuiltInDebugger = 'yes';
            }
        };

        this.copySystemInfo = async () => {
            const PIXI = require('pixi.js');
            const {computer, clipboard} = require('@neutralinojs/lib');
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
            const report = `Ct.js v${process.versions.ctjs} 😽 ${packaged ? '(packaged)' : '(runs from sources)'}\n\n` +
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
