//
    A slider that smoothly transitions between zoom points

    @attribute onchanged (riot function)
        Calls the funtion when a user changes the zoom value.
        Passes the new zoom value as the one argument.

    @method zoomIn
        Call this property to advance the zoom value. This will call opts.onchage callback.
    @method zoomOut
        Call this property to decrease the zoom value. This will call opts.onchage callback.
zoom-slider
    .aSliderWrap
        input(
            type="range" list="theZoomSnapPoints"
            min="-100" step="1" max="100"
            ref="zoomslider"
            value="{zoomToRaw(opts.value || 1)}" oninput="{setValue}"
        )
        datalist#theZoomSnapPoints
            option(value="-100")
            option(value="-67")
            option(value="-33")
            option(value="0")
            option(value="20")
            option(value="40")
            option(value="60")
            option(value="80")
            option(value="100")
        .DataTicks
            .aDataTick(each="{value in [-67, -33, 0, 20, 40, 60, 80]}" style="left: {(value + 100) / 2}%")
    script.
        this.sliderPoints = [-100, -67, -33, 0, 20, 40, 60, 80, 100];
        this.zoomPoints = [0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32];

        this.zoomToRaw = value => {
            value = Number(value);
            const anchorPointId = this.zoomPoints.findIndex(p => p >= value);
            if (this.zoomPoints[anchorPointId] === 0.125) {
                return -100;
            }
            const ab = value - this.zoomPoints[anchorPointId - 1],
                  l = this.zoomPoints[anchorPointId] - this.zoomPoints[anchorPointId - 1];
            const alpha = ab / l;
            return this.sliderPoints[anchorPointId - 1] +
                   (this.sliderPoints[anchorPointId] - this.sliderPoints[anchorPointId - 1]) *
                   alpha;
        };
        this.rawToZoom = value => {
            value = Number(value);
            const anchorPointId = this.sliderPoints.findIndex(p => p >= value);
            if (this.sliderPoints[anchorPointId] === -100) {
                return 0.125;
            }
            const ab = value - this.sliderPoints[anchorPointId - 1],
                  l = this.sliderPoints[anchorPointId] - this.sliderPoints[anchorPointId - 1];
            const alpha = ab / l;
            return this.zoomPoints[anchorPointId - 1] +
                   (this.zoomPoints[anchorPointId] - this.zoomPoints[anchorPointId - 1]) *
                   alpha;
        };

        this.setValue = e => {
            if (this.opts.onchanged) {
                this.opts.onchanged(this.rawToZoom(e.target.value));
            }
        };

        this.zoomIn = () => {
            const rawValue = Math.min(Number(this.refs.zoomslider.value) + 10, 100);
            this.refs.zoomslider.value = rawValue;
            this.opts.onchanged(this.rawToZoom(rawValue));
            this.update();
        };
        this.zoomOut = () => {
            const rawValue = Math.max(Number(this.refs.zoomslider.value) - 10, -100);
            this.refs.zoomslider.value = rawValue;
            this.opts.onchanged(this.rawToZoom(rawValue));
            this.update();
        };
