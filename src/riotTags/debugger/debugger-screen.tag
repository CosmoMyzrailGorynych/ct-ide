debugger-screen(class="{flexrow: verticalLayout, flexcol: !verticalLayout}")
    iframe.tall#thePreview(
        autosize
        partition="persist:gamedebug"
        nodeintegration
        enableremotemodule="false"
        webpreferences="devTools=yes"
        src="empty.html"
    )
    .aResizer(ref="gutter" onmousedown="{gutterMouseDown}" class="{vertical: verticalLayout, horizontal: !verticalLayout}")
    .flexfix.noshrink.nogrow(
        ref="debugWindow"
        style="{verticalLayout? 'width:'+width+'px' : 'height:'+height+'px'}"
    )
        iframe.tall.flexfix-body#theDebugger(
            autosize
            partition="persist:gamedebug"
            webpreferences="devTools=yes"
            src="empty.html"
        )
        .flexfix-footer
            debugger-bottom-panel.flexrow.button-stack(class="{tighten: width <= 425}")
    script.
        const minSizeW = 300;
        const minSizeH = 200; // This includes the height of all buttons
        const getMaxSizeW = () => window.innerWidth - 300;
        const getMaxSizeH = () => window.innerHeight - 300;

        this.verticalLayout = localStorage.debuggerLayour !== 'horizontal';
        this.width = Math.max(minSizeW, Math.min(getMaxSizeW(), localStorage.debuggerWidth || 500));
        this.height = Math.max(minSizeH, Math.min(getMaxSizeH(), localStorage.debuggerHeight || 300));

        // iframes and webviews capture mousemove events needed for resize gutter; this overlay will prevent it
        const catcher = document.createElement('div');
        const s = catcher.style;
        s.position = 'fixed';
        s.left = s.right = s.top = s.bottom = '0';
        s.zIndex = 100;
        s.cursor = 'ew-resize';

        this.gutterMouseDown = e => {
            this.dragging = true;
            document.body.appendChild(catcher);
        };
        document.addEventListener('mousemove', e => {
            if (!this.dragging) {
                return;
            }
            if (this.verticalLayout) {
                this.width = Math.max(minSizeW, Math.min(getMaxSizeW(), window.innerWidth - e.clientX));
                localStorage.debuggerWidth = this.width;
            } else {
                this.height = Math.max(minSizeH, Math.min(getMaxSizeH(), window.innerHeight - e.clientY));
                localStorage.debuggerHeight = this.height;
            }
            this.update();
        });
        document.addEventListener('mouseup', () => {
            if (this.dragging) {
                this.dragging = false;
                document.body.removeChild(catcher);
            }
        });

        this.on('mount', () => {
            const devtools = '127.0.0.1:18364';
            const devurl = 'http://' + devtools + '/devtools/inspector.html?ws=' + devtools + '/devtools/page/';
            const port = /\&port=([\d]+)/g.exec(location.search)[1];
            const gameUrl = `http://localhost:${port}/`;
            const game = document.getElementById('thePreview'),
                  devFrame = document.getElementById('theDebugger');
            game.addEventListener('load', e => {
                fetch('http://' + devtools + '/json')
                .then(res => res.json())
                .then(json => {
                    const targetedDevtools = 'http://' + devtools + json
                        .find(item => item.type === 'iframe' && item.url === gameUrl)
                        .devtoolsFrontendUrl;
                    //devFrame.loadURL(targetedDevtools);
                    devFrame.src = targetedDevtools;
                });
                game.focus();
            });

            //game.loadURL(gameUrl);
            game.src = gameUrl;
        });
