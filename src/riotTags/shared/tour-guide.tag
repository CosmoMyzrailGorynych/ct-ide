//
    Used to create small tours of interface.

    @attribute header (string)
    @attribute tour (ITourSteps[])
        highlight?: HTMLTag;
        message: string (can contain HTML);
        runBefore?: Promise<void>;
        undo?: Promise<void>;
        additionalActions?: {
            label: string;
            click: () => void;
            icon?: string;
        }[]

    @attribute onfinish (riot function)

    @method start
    @method stop
tour-guide
    div(if="{currentStep}")
        .aDimmer(if="{!currentStep.highlight}")
        //
            |-------------------------------|
            |               T               |
            |-------|———————————————|-------|
            |   L   |   highlight   |   R   |
            |-------|———————————————|-------|
            |               B               |
            |-------------------------------|
        // top half
        .tour-guide-aMask(if="{currentStep.highlight}" style="top: 0; height: {highlightRect.top}px; bottom: unset;")
        // bottom half
        .tour-guide-aMask(if="{currentStep.highlight}" style="top: {highlightRect.bottom}px; bottom: 0;")
        // left segment
        .tour-guide-aMask(if="{currentStep.highlight}" style="top: {highlightRect.top}px; height:{highlightRect.height}px; bottom: unset; left: 0; width: {highlightRect.left}px; right: unset;")
        // right segment
        .tour-guide-aMask(if="{currentStep.highlight}" style="top: {highlightRect.top}px; height:{highlightRect.height}px; bottom: unset; left: {highlightRect.right}px; right: 0;")
        .tour-guide-aHighlight(if="{currentStep.highlight}" onclick="{nextStep}" style="top: {highlightRect.top}px; left: {highlightRect.left}px; width: {highlightRect.width}px; height: {highlightRect.height}px;")
        .aModal.flexfix.pad.npb(style="{messagePos}" ref="modal")
            .flexfix-header
                button.toright.nm.tiny(onclick="{stop}" title="{voc.close}")
                    svg.feather
                        use(xlink:href="#x")
                h2(if="{opts.header}").nm {opts.header}
            .flexfix-body
                raw(content="{currentStep.message}")
                .aProgressbar.wide
                    div(style="width: {(opts.tour.indexOf(currentStep) + 1) / opts.tour.length * 100}%")
            .flexfix-footer.flexrow.inset
                button.nml.nogrow(onclick="{prevStep}" if="{opts.tour.indexOf(currentStep) > 0}")
                    svg.feather
                        use(xlink:href="#chevron-left")
                    span {voc.previous}
                .aSpacer
                button.nogrow(
                    if="{currentStep.additionalActions}"
                    each="{action in currentStep.additionalActions}"
                    onclick="{action.click}"
                )
                    svg.feather(if="{action.icon}")
                        use(xlink:href="#{action.icon}")
                    span {action.label}
                button.nmr.nogrow(onclick="{nextStep}" if="{opts.tour.indexOf(currentStep) < opts.tour.length - 1}")
                    span {voc.next}
                    svg.feather
                        use(xlink:href="#chevron-right")
                button.nmr.nogrow(onclick="{completeTour}" if="{opts.tour.indexOf(currentStep) === opts.tour.length - 1}")
                    svg.feather
                        use(xlink:href="#check")
                    span {voc.done}
    script.
        this.namespace = 'common';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        const clamp = (min, val, max) => Math.min(max, Math.max(min, val));
        const pad = 24;
        const modalHWidth = 240;
        const updatePositions = () => {
            if (!this.currentStep) {
                return;
            }
            this.messagePos = {};
            if (this.currentStep.highlight) {
                this.highlightRect = this.currentStep.highlight.getBoundingClientRect();
                const hR = this.highlightRect;
                const wide = (hR.width >= modalHWidth * 2) || (hR.width > hR.height);
                const middleX = hR.x + hR.width / 2,
                      middleY = hR.y + hR.height / 2,
                      winW = window.innerWidth,
                      winH = window.innerHeight;
                // Need to get the height of the modal
                this.update();
                const modalsDimensions = this.refs.modal.getBoundingClientRect();
                if (wide) {
                    // Position the modal beneath or above the highlighted element
                    if (middleY > winH / 2) {
                        // Place it above
                        this.messagePos.top = hR.y - modalsDimensions.height - pad;
                    } else {
                        // Place it below
                        this.messagePos.top = (hR.y + hR.height + pad);
                    }
                    // Place at the middle horizontally
                    this.messagePos.left = hR.x + hR.width / 2 - modalHWidth;
                } else {
                    // Position the modal to the left or right of the highlighted element
                    if (middleX > winW / 2) {
                        // Place it on the left
                        // We know the size of the modal on the needed axis this time
                        this.messagePos.left = hR.x - modalHWidth * 2 - pad;
                    } else {
                        // Place it on the right
                        this.messagePos.left = hR.x + hR.width + pad;
                    }
                    // Place at the middle vertically
                    this.messagePos.top = hR.y + hR.height / 2 - modalsDimensions.height / 2;
                }
                // Clamp modal's position and add 'px' unit
                this.messagePos.left = clamp(pad, this.messagePos.left, winW - modalsDimensions.width - pad) + 'px';
                this.messagePos.top = clamp(pad, this.messagePos.top, winH - modalsDimensions.height - pad) + 'px';
            } else {
                // Position in the center of the screen
                this.highlightRect = void 0;
                this.messagePos = {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                };
            }
            this.update();
        };
        this.on('mount', () => {
            window.addEventListener('resize', updatePositions);
        });
        this.on('unmount', () => {
            window.removeEventListener('resize', updatePositions);
        });

        this.start = async () => {
            [this.currentStep] = this.opts.tour;
            if (this.currentStep.runBefore) {
                await this.currentStep.runBefore();
            }
            updatePositions();
        };
        this.stop = () => {
            this.currentStep = void 0;
            this.update();
        };
        this.completeTour = () => {
            this.stop();
            if (this.opts.onfinish) {
                this.opts.onfinish();
            }
        };
        this.prevStep = async () => {
            if (this.currentStep.undo) {
                await this.currentStep.undo();
            }
            const currentStepIndex = this.opts.tour.indexOf(this.currentStep);
            this.currentStep = this.opts.tour[currentStepIndex - 1];
            updatePositions();
        };
        this.nextStep = async () => {
            const currentStepIndex = this.opts.tour.indexOf(this.currentStep);
            if (currentStepIndex === this.opts.tour.length - 1) {
                return;
            }
            this.currentStep = this.opts.tour[currentStepIndex + 1];
            if (this.currentStep.runBefore) {
                await this.currentStep.runBefore();
            }
            updatePositions();
            this.update();
        };
