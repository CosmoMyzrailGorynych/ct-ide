//
    Displays an editable curve with a grid, point editor and scales.

    @attribute curve (riot Array<ValueStep<number>>)
        @see https://pixijs.io/pixi-particles/docs/interfaces/valuestep.html
    @attribute colorcurve (riot Array<ValueStep<string>>)
        Required if an attribute `type` is set to 'color'.
        @see https://pixijs.io/pixi-particles/docs/interfaces/valuestep.html
    @attribute onchange (riot function)
        Called when a user drags a curve's point.
        Passes the whole curve and an edited point as its arguments.

    @attribute [lockstarttime] (atomic)
        Locks the time of the firts point in the curve.
        Also, it forbids the deletion of this point.
    @attribute [lockendtime] (atomic)
        Locks the time of the last point in the curve.
        Also, it forbids the deletion of this point.
    @attribute [lockstartvalue] (atomic)
        Locks the value of the first point in the curve.
        Also, it forbids the deletion of this point.
    @attribute [lockendvalue] (atomic)
        Locks the value of the last point in the curve.
        Also, it forbids the deletion of this point.

    @attribute [timestep] (number)
        A step size for a manual point editor. Defaults to 0.01.
    @attribute [valuestep] (number)
        A step size for a manual point editor. Defaults to 0.01.

    @attribute [type] (string, 'float'|'color')
        Defaults to 'float'; if set to 'color', requires
        an attribute `colorcurve` to be set and allows for color editing.
    @attribute [easing] (string, 'linear'|'none')
        Defaults to 'linear'.
    @attribute [coloreasing] (string, 'linear'|'none')
        Defaults to 'linear'.

curve-editor(ref="root")
    span(if="{!curve || min === void 0 || max === void 0}") Error :c
    span(if="{curve && min !== void 0 && max !== void 0 && width !== void 0 && height !== void 0}")
        .curve-editor-aGraphWrap
            .curve-editor-aRuler.flexrow
                span(each="{pos in [0, 0.2, 0.4, 0.6, 0.8, 1]}") {niceNumber(minTime + (pos * (maxTime - minTime)))}
            .curve-editor-aRuler.flexcol
                span(each="{pos in [1, 0.8, 0.6, 0.4, 0.2, 0]}") {niceNumber(min + (pos * (max - min)))}
            svg(xmlns="http://www.w3.org/2000/svg" riot-viewbox="0 0 {width} {height}" ref="graph" onmousemove="{onGraphMouseMove}")
                defs
                    filter#greyOutlineEffect
                        feMorphology(in="SourceAlpha" result="MORPH" operator="dilate" radius="2")
                        feColorMatrix(in="MORPH" result="WHITENED" type="matrix" values="-1 0 0 0.8 0, 0 -1 0 0.8 0, 0 0 -1 0.8 0, 0 0 0 1 0")
                        feMerge
                            feMergeNode(in="WHITENED")
                            feMergeNode(in="SourceGraphic")
                    linearGradient(
                        each="{point, ind in opts.colorcurve}"
                        if="{opts.type === 'color' && (ind < opts.curve.length - 1)}"
                        riot-id="{uid}grad{ind}to{ind+1}"
                        x1="0%" y1="0%" x2="100%" y2="0%"
                    )
                        stop(offset="0%" style="\
                            stop-color:#{point.value};\
                            stop-opacity:{parent.opts.curve[ind].value}\
                        ")
                        stop(offset="100%" style="\
                            stop-color:#{parent.opts.colorcurve[parent.opts.coloreasing === 'none'? ind : ind+1].value};\
                            stop-opacity:{parent.opts.curve[parent.opts.easing === 'none'? ind : ind+1].value}\
                        ")
                g.curve-editor-aGrid
                    polyline(
                        each="{pos in [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1]}"
                        riot-points="0,{pos * height} {width},{pos * height}"
                        class="{aMiddleLine: pos === 0.5}"
                    )
                    polyline(
                        each="{pos in [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1]}"
                        riot-points="{pos * width},0 {pos * width},{height}"
                        class="{aMiddleLine: pos === 0.5}"
                    )
                // About + 0.00001: for some reason, 0 height hides curve segments with gradients completely
                g.curve-editor-aCurve
                    polyline(
                        each="{point, ind in curve}"
                        riot-points="\
                            {getPointLeft(point)},{getPointTop(point)}\
                            {getPointLeft(curve[ind+1])},{getPointTop(parent.opts.easing === 'none'? point : curve[ind+1]) + 0.00001}\
                        "
                        stroke="{parent.opts.type === 'color' && 'url(#'+uid+'grad'+ind+'to'+(ind+1)+')'}"
                        filter="{parent.opts.type === 'color'? 'url(#greyOutlineEffect)' : ''}"
                        if="{ind !== curve.length - 1}"
                        onmousedown="{addPointOnSegment}"
                        title="{voc.curveLineHint}"
                    )
            .aDragger(
                each="{point, ind in curve}"
                style="\
                    left: {getPointLeft(point)}px;\
                    top: {getPointTop(point)}px;\
                    {movedPoint? 'pointer-events: none;' : ''}\
                    {parent.opts.type === 'color'? 'background-color: #'+parent.opts.colorcurve[ind].value : ''}\
                "
                class="{selected: selectedPoint === point}"
                onmousedown="{startMoving(point)}"
                oncontextmenu="{deletePoint}"
                title="{voc.dragPointHint}"
            )
        div
            label.fifty.npl.npb.nmt
                span {voc.pointTime}
                input.wide(
                    type="number"
                    min="{minTime}" max="{maxTime}"
                    step="{opts.timestep || 0.01}"
                    value="{selectedPoint.time}"
                    oninput="{updateTime}"
                    disabled="{(opts.lockstarttime && selectedPoint === opts.curve[0]) || (opts.lockendtime && selectedPoint === opts.curve[opts.curve.length - 1])}"
                )
            label.fifty.npr.npb.nmt(if="{opts.type !== 'color'}")
                span {voc.pointValue}
                input.wide(
                    type="number"
                    min="{min}" max="{max}"
                    step="{opts.valuestep || 0.01}"
                    value="{selectedPoint.value}"
                    oninput="{wireAndChange('this.selectedPoint.value')}"
                    disabled="{(opts.lockstartvalue && selectedPoint === opts.curve[0]) || (opts.lockendvalue && selectedPoint === opts.curve[opts.curve.length - 1])}"
                )
            div.fifty.npr.npb.nmt(if="{opts.type === 'color'}")
                span {voc.pointValue}
                color-input.wide(
                    color="#{selectedColorPoint.value}"
                    onchange="{updateColor}"
                    onapply="{updateColor}"
                    hidealpha="true"
                )
            .clear
    script.
        /* global net */
        this.namespace = 'curveEditor';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        const brehautColor = net.brehaut.Color;

        this.uid = require('./data/node_requires/generateGUID')();

        this.wireAndChange = path => e => {
            this.wire(path)(e);
            if (this.opts.onchange) {
                this.opts.onchange(this.curve, this.movedPoint);
            }
        };
        this.updateTime = e => {
            this.wireAndChange('this.selectedPoint.time')(e);
            if (this.opts.type === 'color') {
                this.wireAndChange('this.selectedColorPoint.time')(e);
            }
        };
        this.updateColor = e => {
            this.selectedColorPoint.value = e.target.value.slice(1);
            if (this.opts.onchange) {
                this.opts.onchange(this.curve, this.movedPoint);
            }
            this.update();
        };

        [this.selectedPoint] = this.opts.curve;

        this.niceNumber = number => {
            if (number < 10 && number > -10) {
                return number.toPrecision(2);
            }
            return Math.round(number);
        };
        this.updateLayout = () => {
            [this.selectedPoint] = this.opts.curve;
            if (this.opts.colorcurve) {
                [this.selectedColorPoint] = this.opts.colorcurve;
            }
            const box = this.refs.root.getBoundingClientRect();
            this.curve = this.opts.curve || [{
                time: 0,
                value: 0
            }, {
                time: 1,
                value: 1
            }];
            this.width = box.width;
            this.height = Number(this.opts.height || 200);
            this.min = Number(this.opts.min || 0);
            this.max = Number(this.opts.max || 1);
            this.minTime = Number(this.opts.mintime || 0);
            this.maxTime = Number(this.opts.maxtime || 1);
            this.update();
        };
        setTimeout(this.updateLayout, 0);

        let startMoveX, startMoveY, oldTime, oldValue;
        this.startMoving = point => e => {
            this.selectedPoint = point;
            if (this.opts.type === 'color') {
                this.selectedColorPoint = this.opts.colorcurve[this.opts.curve.indexOf(point)];
            }
            if (e.button !== 0) {
                return;
            }
            this.movedPoint = point;
            if (this.opts.type === 'color') {
                this.movedColorPoint = this.selectedColorPoint;
            }
            startMoveX = e.screenX;
            startMoveY = e.screenY;
            oldTime = point.time;
            oldValue = point.value;
        };
        this.onGraphMouseMove = e => {
            if (!this.movedPoint) {
                return;
            }
            const dx = e.screenX - startMoveX;
            const dy = e.screenY - startMoveY;
            const box = this.refs.graph.getBoundingClientRect();
            if ((!this.opts.lockstarttime || this.movedPoint !== this.curve[0]) &&
                (!this.opts.lockendtime || this.movedPoint !== this.curve[this.curve.length - 1])
            ) {
                this.movedPoint.time = oldTime + dx / box.width * (this.maxTime - this.minTime);
                this.movedPoint.time = Math.min(Math.max(this.movedPoint.time, this.minTime), this.maxTime);
                if (this.opts.type === 'color') {
                    this.movedColorPoint.time = this.movedPoint.time;
                }
            }
            if ((!this.opts.lockstartvalue || this.movedPoint !== this.curve[0]) &&
                (!this.opts.lockendvalue || this.movedPoint !== this.curve[this.curve.length - 1])
            ) {
                this.movedPoint.value = oldValue - dy / box.height * (this.max - this.min);
                this.movedPoint.value = Math.min(Math.max(this.movedPoint.value, this.min), this.max);
            }
            if (this.opts.type === 'color') {
                this.opts.colorcurve.sort((a, b) => a.time - b.time);
            }
            this.curve.sort((a, b) => a.time - b.time);
            this.update();
            if (this.opts.onchange) {
                this.opts.onchange(this.curve, this.movedPoint);
            }
        };

        this.addPointOnSegment = e => {
            const gx = e.layerX,
                  gy = e.layerY;
            const point = {
                time: gx / this.width * (this.maxTime - this.minTime) + this.minTime,
                value: (1 - gy / this.height) * (this.max - this.min)
            };
            if (this.opts.type === 'color') {
                let fromPoint, toPoint;
                // Find the two points surrounding a new one for blending
                for (let i = 1; i < this.opts.curve.length; i++) {
                    if (this.opts.colorcurve[i].time > point.time) {
                        fromPoint = this.opts.colorcurve[i - 1];
                        toPoint = this.opts.colorcurve[i];
                        break;
                    }
                }
                if (!fromPoint || !toPoint) {
                    return;
                }
                // eslint-disable-next-line new-cap
                const color1 = brehautColor('#' + fromPoint.value),
                      // eslint-disable-next-line new-cap
                      color2 = brehautColor('#' + toPoint.value);
                const mixedColor = (point.time - fromPoint.time) / (toPoint.time - fromPoint.time);
                this.opts.colorcurve.push({
                    time: point.time,
                    value: color1
                        .blend(color2, mixedColor)
                        .toString()
                        .slice(1)
                });
                this.opts.colorcurve.sort((a, b) => a.time - b.time);
            }
            this.curve.push(point);
            this.curve.sort((a, b) => a.time - b.time);
            if (this.opts.onchange) {
                this.opts.onchange(this.curve, this.movedPoint);
            }
            /* Start dragging the same point */
            this.startMoving(point)(e);
        };
        this.deletePoint = e => {
            const o = this.opts;
            if (e.item.point === this.curve[0] && (o.lockstarttime || o.lockstartvalue)) {
                return;
            }
            if (e.item.point === this.curve[this.curve.length - 1] && (o.lockendtime || o.lockendvalue)) {
                return;
            }
            const ind = o.curve.indexOf(e.item.point);
            if (ind !== -1) {
                const spliced = o.curve.splice(ind, 1);
                if (this.opts.type === 'color') {
                    o.colorcurve.splice(ind, 1);
                }
                if (spliced[0] === this.selectedPoint) {
                    [this.selectedPoint] = o.curve;
                    if (this.opts.type === 'color') {
                        [this.selectedColorPoint] = o.colorcurve;
                    }
                }
                if (this.opts.onchange) {
                    this.opts.onchange(this.curve, this.movedPoint);
                }
            }
        };

        const onMouseUp = () => {
            this.movedPoint = false;
        };
        this.on('mount', () => {
            document.addEventListener('mouseup', onMouseUp);
        });
        this.on('unmount', () => {
            document.removeEventListener('mouseup', onMouseUp);
        });

        this.getPointTop = point =>
            (1 - (point.value - this.min) / (this.max - this.min)) * this.height;
        this.getPointLeft = point =>
            (point.time - this.minTime) / this.maxTime * this.width;
