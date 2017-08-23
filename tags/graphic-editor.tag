graphic-editor.panel.view
    .column.column2.borderleft.tall(if="{!opts.graphic.frames || opts.graphic.frames === 1}")
        .fifty
            b {voc.cols}
            br
            input.wide(type="number" value="{opts.graphic.grid[0]}" onchange="wire('this.opts.graphic.grid.0')")
            br
        .fifty
            b {voc.rows}
            br
            input.wide(type="number" value="{opts.graphic.grid[1]}" onchange="wire('this.opts.graphic.grid.1')")
            br
        .fifty
            b {voc.width}
            br
            input.wide(type="number" value="{opts.graphic.width}" onchange="wire('this.opts.graphic.width')")
            br
        .fifty
            b {voc.height}
            br
            input.wide(type="number" value="{opts.graphic.height}" onchange="wire('this.opts.graphic.height')")
            br
        .fifty
            b {voc.marginx}
            br
            input.wide(type="number" value="{opts.graphic.marginx}" onchange="wire('this.opts.graphic.marginx')")
            br
        .fifty
            b {voc.marginy}
            br
            input.wide(type="number" value="{opts.graphic.marginy}" onchange="wire('this.opts.graphic.marginy')")
            br
        .fifty
            b {voc.offx}
            br
            input.wide(type="number" value="{opts.graphic.offx}" onchange="wire('this.opts.graphic.offx')")
            br
        .fifty
            b {voc.offy}
            br
            input.wide(type="number" value="{opts.graphic.offy}" onchange="wire('this.opts.graphic.offy')")
            br
        b {voc.frames}
        br
        input#graphframes.wide(type="number" value="{opts.graphic.untill}" onchange="wire('this.opts.graphic.untill')")
    //-
        button#graphsplicedone.wide(onclick="graphicFinishSplit")
            i.icon.icon-confirm
            span {voc.done}

    #atlas
        .graphview-tools
            label.file(title="{voc.replacegraph}")
                button#graphreplace.inline
                    i.icon.icon-folder
                input#inputgraphreplace(type="file" ref="graphReplacer" accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphReplace}")
            //- TODO
            .button-stack
                button.inline(title="#graphview.tools.deleteframe" onclick="{graphicDeleteFrame}")
                    i.icon.icon-delete
                button.inline(title="#graphview.tools.duplicateframe" onclick="{graphicDuplicateFrame}")
                    i.icon.icon-duplicate
                button.inline(title="#graphview.tools.addframe" onclick="{graphicAddFrame}")
                    i.icon.icon-plus
            .button-stack
                button.inline(title="#graphview.tools.shift" onclick="{graphicShift}")
                    i.icon.icon-move-view
                button.inline(title="#graphview.tools.flipvertical" onclick="{graphicFlipVertical}")
                    i.icon.icon-flip-vertical
                button.inline(title="#graphview.tools.fliphorizontal" onclick="{graphicFlipHorizontal}")
                    i.icon.icon-flip-horisontal
                button.inline(title="#graphview.tools.rotate" onclick="{graphicRotate}")
                    i.icon.icon-refresh
            .button-stack
                button.inline(title="#graphview.tools.resize" onclick="{graphicResize}")
                    i.icon.icon-maximize
                button.inline(title="#graphview.tools.crop" onclick="{graphicCrop}")
                    i.icon.icon-crop
        canvas(ref="graphCanvas")

    .column.borderright.tall.column1
        b {voc.name}
        br
        input#graphname(type="text" value="{opts.graphic.name}" onchange="wire('this.opts.graphic.name')")
        br
        b {voc.center}
        br
        input#graphx.short(type="number" value="{opts.graphic.axis[0]}" onchange="{wire('this.opts.graphic.axis.0')}")
        | ×
        input#graphy.short(type="number" value="{opts.graphic.axis[1]}" onchange="{wire('this.opts.graphic.axis.1')}")
        br
        br
        button#graphcenter.wide(onclick="{graphicCenter}") {voc.setcenter}
        br
        b {voc.form}
        br
        label
            input(type="radio" name="collisionform" value="circle" checked="{opts.graphic.shape === 'circle'}" onclick="{graphicSelectCircle}")
            span {voc.round}
        br
        label
            input(type="radio" name="collisionform" value="rect" checked="{opts.graphic.shape === 'rect'}" onclick="{graphicSelectRect}")
            span {voc.rectangle}
        br
        br
        #graphviewround(if="{opts.graphic.shape === 'circle'}")
            b {voc.radius}
            br
            input#graphrad(type="number" value="{opts.graphic.r}" onchange="{wire('this.opts.graphic.r')}")
        #graphviewrect(if="{opts.graphic.shape === 'rect'}")
            .center
            input#graphtop.short(type="number" value="{opts.graphic.top}" onchange="{wire('this.opts.graphic.top')}")
            br
            input#graphleft.short(type="number" value="{opts.graphic.left}" onchange="{wire('this.opts.graphic.left')}")
            | ×
            input#graphright.short(type="number" value="{opts.graphic.right}" onchange="{wire('this.opts.graphic.right')}")
            br
            input#graphbottom.short(type="number" value="{opts.graphic.bottom}" onchange="{wire('this.opts.graphic.bottom')}")
            br
            button.wide(onclick="{graphicFillRect}")
                i.icon.icon-maximize
                span {voc.fill}

    .preview.bordertop
        #preview
            canvas(ref="grprCanvas")
        div
            button#graphplay.square.inline(onclick="{currentGraphicPreviewPlay}")
                i.icon(class="{this.prevPlaying? 'pause' : 'play'}")
            button#graphviewback.square.inline(onclick="{currentGraphicPreviewBack}")
                i.icon.icon-back
            button#graphviewnext.square.inline(onclick="{currentGraphicPreviewNext}")
                i.icon.icon-next
            span#graphviewframe {prevPos} / undef
            b {voc.speed}
            input#grahpspeed.short(type="number" value="{prevSpeed}" onchange="{wire(this.prevSpeed)}")
        button#graphcolor.inline.wide(onclick="{currentGraphicPreviewColor}")
            i.icon.icon-brush
            span {voc.bgcolor}
        input.color.rgb#previewbgcolor
        br
        input(checked="{prevShowMask}" onchange="{wire('this.prevShowMask')}" type="checkbox")
        span {voc.showmask}
    button(onclick="{graphicSave}") 
        span {voc.save}
    script.
        const path = require('path'),
              fs = require('fs-extra');
        this.voc = window.languageJSON.graphview;
        this.mixin(window.riotWired);
        
        this.prevPlaying = false;
        this.prevPos = 0;
        this.prevSpeed = 10;
        this.prevShowMask = false;
        
        var graphCanvas, grprCanvas;
        
        this.on('mount', () => {
            graphCanvas = this.refs.graphCanvas;
            grprCanvas = this.refs.grprCanvas;
            graphCanvas.x = graphCanvas.getContext('2d');
            grprCanvas.x = grprCanvas.getContext('2d');
            var graphic = this.opts.graphic;
            
            if (!graphic.frames || graphic.frames.length === 1) {
                var img = document.createElement('img');
                img.src = sessionStorage.projdir + '/img/' + graphic.origname;
                img.onload = function() {
                    graphic.frames = graphic.grid[0],grid[1];
                    graphic.width = img.width / graphic.grid[0];
                    graphic.height = img.height / graphic.grid[0];
                };
                img.onerror = function() {
                    alertify.error(languageJSON.graphview.corrupted);
                    events.graphicSave();
                };
            }
            
            $('#grahpspeed').val(10);
            this.launchGraphPreview();
        });
        
        this.graphReplace = e => {
            if (/\.(jpg|gif|png|jpeg)/gi.test(this.refs.graphReplacer.value)) {
                console.log(this.refs.graphReplacer.value, 'passed');
                this.parent.loadImg(
                    0,
                    this.refs.graphReplacer.value,
                    sessionStorage.projdir + '/img/i' + parseInt(currentGraphic.origname.slice(1)) + path.extname(this.refs.graphReplacer.value),
                    false
                );
            } else {
                window.alertify.error(window.languageJSON.common.wrongFormat);
                console.log(this.refs.graphReplacer.value, 'NOT passed');
            }
            this.refs.graphReplacer.value = '';
        };
        
        // TODO
        this.graphicDeleteFrame = e => {
            
        };
        this.graphicDuplicateFrame = e => {
            
        };
        this.graphicAddFrame = e => {
            
        };
        this.graphicShift = e => {
            
        };
        this.graphicFlipVertical = e => {
            
        };
        this.graphicFlipHorizontal = e => {
            
        };
        this.graphicRotate = e => {
            
        };
        this.graphicResize = e => {
            
        };
        this.graphicCrop = e => {
            
        };

        /**
         * Установить ось вращения на центр изображения
         */
        this.graphicCenter = e => {
            var graphic = this.opts.graphic;
            graphic.axis[0] = Math.floor(graphic.width / graphic.grid[0] / 2);
            graphic.axis[1] = Math.floor(graphic.height / graphic.grid[1] / 2);
            this.refreshGraphCanvas();
        };
        /**
         * Заполнить всё изображение маской-квадратом 
         */
        this.graphicFillRect = e => {
            var graphic = this.opts.graphic;
            graphic.left = ~~(graphic.axis[0]);
            graphic.top = ~~(graphic.axis[1]);
            graphic.right = ~~(graphic.width / graphic.grid[0] - graphic.axis[0]);
            graphic.bottom = ~~(graphic.height / graphic.grid[1] - graphic.axis[1]);
            this.refreshGraphCanvas();
        };
        /**
         * Запустить предпросмотр анимации
         */
        this.currentGraphicPreviewPlay = e => {
            if (this.prevPlaying) {
                this.stopGraphPreview();
            } else {
                this.launchGraphPreview();
            }
            this.prevPlaying = !this.prevPlaying;
        };
        /**
         * Отступить на шаг назад в предпросмотре анимации
         */
        this.currentGraphicPreviewBack = e => {
            this.prevPos--;
            var graphic = this.opts.graphic;
            var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
            if (this.prevPos < 0) {
                this.prevPos = graphic.untill === 0 ? graphic.grid[0] * graphic.grid[1] : total - 0;
            }
            grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
            grprCanvas.x.drawImage(graphCanvas.img, (this.prevPos % graphic.grid[0]) * graphCanvas.img.width / graphic.grid[0], (~~(this.prevPos / graphic.grid[0])) * graphCanvas.img.height / graphic.grid[1],
                graphCanvas.img.width / graphic.grid[0],
                graphCanvas.img.height / graphic.grid[1],
                0,
                0,
                grprCanvas.width,
                grprCanvas.height);
        };
        /**
         * Шагнуть на кадр вперёд в предпросмотре анимации
         */
        this.currentGraphicPreviewNext = e => {
            this.prevPos++;
            var graphic = this.opts.graphic;
            var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
            grprCanvas.x.drawImage(graphCanvas.img, (this.prevPos % graphic.grid[0]) * graphCanvas.img.width / graphic.grid[0], (~~(this.prevPos / graphic.grid[0])) * graphCanvas.img.height / graphic.grid[1],
                graphCanvas.img.width / graphic.grid[0],
                graphCanvas.img.height / graphic.grid[1],
                0,
                0,
                grprCanvas.width,
                grprCanvas.height);
        };
        /**
         * Открыть колорпикер для выбора цвета фона предпросмотра анимации
         */
        this.currentGraphicPreviewColor = e => {
            $('#previewbgcolor').focus();
        };
        /**
         * Остановить предпросмотр анимации
         */
        this.stopGraphPreview = () => {
            window.clearTimeout(this.prevTime);
        };
        /**
         * Запустить предпросмотр анимации
         */
        this.launchGraphPreview = () => {
            var graphic = this.opts.graphic;
            if (this.prevTime) {
                window.clearTimeout(this.prevTime);
            }
            var kw, kh, w, h, k;
            this.prevPos = 0;
        
            kw = Math.min($('#preview').width() / (graphCanvas.img.width / graphic.grid[0]), 1);
            kh = Math.min($('#preview').height() / (graphCanvas.img.height / graphic.grid[1]), 1);
            k = Math.min(kw, kh);
            w = Math.floor(k * graphCanvas.img.width / graphic.grid[0]);
            h = Math.floor(k * graphCanvas.img.height / graphic.grid[1]);
            grprCanvas.width = w;
            grprCanvas.height = h;
            this.stepGraphPreview();
        };
        /**
         * Шаг анимации в предпросмотре. Выполняет рендер. Записывает таймер следующего шага в this.prevTime
         */
        this.stepGraphPreview = () => {
            var graphic = this.opts.graphic;
            this.prevTime = window.setTimeout(() => {
                var total = Math.min(graphic.untill === 0 ? graphic.grid[0] * graphic.grid[1] : graphic.untill, graphic.grid[0] * graphic.grid[1]);
                glob.prev.pos++;
                if (glob.prev.pos >= total) {
                    glob.prev.pos = 0;
                }
                grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
                grprCanvas.x.drawImage(graphCanvas.img, (glob.prev.pos % graphic.grid[0]) * graphCanvas.img.width / graphic.grid[0], (~~(glob.prev.pos / graphic.grid[0])) * graphCanvas.img.height / graphic.grid[1],
                    graphCanvas.img.width / graphic.grid[0],
                    graphCanvas.img.height / graphic.grid[1],
                    0,
                    0,
                    grprCanvas.width,
                    grprCanvas.height);
                if (this.prevShowMask) {
                    var kw, kh, w, h, k, i;
        
                    kw = Math.min(($('#atlas').width() - 40) / grprCanvas.img.width, 1);
                    kh = Math.min(($('#atlas').height() - 40) / grprCanvas.img.height, 1);
                    k = Math.min(kw, kh);
                    w = Math.floor(k * grprCanvas.img.width);
                    h = Math.floor(k * grprCanvas.img.height);
        
                    grprCanvas.x.strokeStyle = "#f00";
                    // horisontal
                    grprCanvas.x.beginPath();
                    grprCanvas.x.moveTo(0, graphic.axis[1] * k);
                    grprCanvas.x.lineTo(grprCanvas.img.width * k / graphic.grid[0], graphic.axis[1] * k);
                    grprCanvas.x.stroke();
                    // vertical
                    grprCanvas.x.beginPath();
                    grprCanvas.x.moveTo(graphic.axis[0] * k, 0);
                    grprCanvas.x.lineTo(graphic.axis[0] * k, grprCanvas.img.height * k / graphic.grid[1]);
                    grprCanvas.x.stroke();
                    // shape
                    grprCanvas.x.globalAlpha = 0.5;
                    grprCanvas.x.fillStyle = '#ff0';
                    if (graphic.shape == 'rect') {
                        grprCanvas.x.fillRect((graphic.axis[0] - graphic.left) * k, (graphic.axis[1] - graphic.top) * k, (graphic.right + graphic.left) * k, (graphic.bottom + graphic.top) * k);
                    } else {
                        grprCanvas.x.beginPath();
                        grprCanvas.x.arc(graphic.axis[0] * k, graphic.axis[1] * k, graphic.r * k, 0, 2 * Math.PI);
                        grprCanvas.x.fill();
                    }
                }
                this.update();
                this.stepGraphPreview();
            }, ~~(1000 / this.prevSpeed));
        };

        /**
         * Переключает тип маски на круг и выставляет начальные параметры
         */
        this.graphicSelectCircle = function() {
            this.opts.graph.shape = 'circle';
            if (currentGraphic.r == 0 || !currentGraphic.r) {
                r = Math.min(Math.floor(currentGraphic.width / currentGraphic.grid[0] / 2),
                    Math.floor(currentGraphic.height / currentGraphic.grid[1] / 2));
            }
        };
        /**
         * Переключает тип маски на прямоугольник и выставляет начальные параметры
         */
        this.graphicSelectRect = function() {
            this.opts.graph.shape = 'rect';
            this.graphicFillRect();
        };
        /**
         * Перерисовывает канвас со спрайтом со всеми масками и делениями
         */
        events.refreshGraphCanvas = function() {
            var kw, kh, w, h, k, i;
        
            kw = Math.min(($('#atlas').width() - 40) / graphCanvas.img.width, 1);
            kh = Math.min(($('#atlas').height() - 40) / graphCanvas.img.height, 1);
            k = Math.min(kw, kh);
            w = Math.floor(k * graphCanvas.img.width);
            h = Math.floor(k * graphCanvas.img.height);
            graphCanvas.width = w;
            graphCanvas.height = h;
            graphCanvas.x.strokeStyle = "#0ff";
            graphCanvas.x.lineWidth = 1;
            graphCanvas.x.globalCompositeOperation = 'source-over';
            graphCanvas.x.clearRect(0, 0, w, h);
            graphCanvas.x.drawImage(graphCanvas.img, 0, 0, w, h);
            graphCanvas.x.globalAlpha = 0.5;
        
            // 0 - cols
            // 1 - rows
        
            // cols
            for (i = 0; i <= currentGraphic.grid[0]; i++) {
                graphCanvas.x.beginPath();
                graphCanvas.x.moveTo(i * graphCanvas.img.width * k / currentGraphic.grid[0], 0);
                graphCanvas.x.lineTo(i * graphCanvas.img.width * k / currentGraphic.grid[0], h);
                graphCanvas.x.stroke();
            }
            //rows
            for (i = 0; i <= currentGraphic.grid[1]; i++) {
                graphCanvas.x.beginPath();
                graphCanvas.x.moveTo(0, i * graphCanvas.img.height * k / currentGraphic.grid[1]);
                graphCanvas.x.lineTo(w, i * graphCanvas.img.height * k / currentGraphic.grid[1]);
                graphCanvas.x.stroke();
            }
        
            // unused frames
            if (currentGraphic.untill !== 0) {
                graphCanvas.x.globalAlpha = 0.5;
                graphCanvas.x.fillStyle = '#f00';
                for (var i = currentGraphic.untill; i < currentGraphic.grid[0] * currentGraphic.grid[1]; i++) {
                    graphCanvas.x.fillRect(w / currentGraphic.grid[0] * (i % currentGraphic.grid[0]),
                        h / currentGraphic.grid[1] * (~~(i / currentGraphic.grid[0])),
                        w / currentGraphic.grid[0],
                        h / currentGraphic.grid[1]);
                }
            }
        };
        
        /**
         * Событие сохранения графики
         */
        this.graphicSave = function() {
            this.graphGenPreview(true, sessionStorage.projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png', 64);
            this.graphGenPreview(false, sessionStorage.projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev@2.png', 128);
            this.parent.fillGraphMap();
            window.glob.modified = true;
            this.parent.editing = false;
            this.parent.update();
        };
        
        /**
         * Генерирует превьюху первого кадра графики
         */
        this.graphGenPreview = function(replace, destination, size) {
            // destination = sessionStorage.projdir + '/img/' + currentProject.graphs[currentGraphicId].destinatione + '_prev.png'
            var c = document.createElement('canvas'), 
                w, h, k;
            c.x = c.getContext('2d');
            c.width = c.height = size;
            c.x.clearRect(0, 0, size, size);
            w = graphCanvas.img.width / currentGraphic.grid[0];
            h = graphCanvas.img.height / currentGraphic.grid[1];
            if (w > h) {
                k = size / w;
            } else {
                k = size / h;
            }
            if (k > 1) k = 1;
            c.x.drawImage(graphCanvas.img,
                0,
                0,
                graphCanvas.img.width / currentGraphic.grid[0],
                graphCanvas.img.height / currentGraphic.grid[1],
                (size - graphCanvas.img.width*k)/2,
                (size - graphCanvas.img.height*k)/2,
                graphCanvas.img.width*k,
                graphCanvas.img.height*k
            );
            var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            fs.writeFile(destination, buf, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        };
