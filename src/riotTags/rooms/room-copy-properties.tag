room-copy-properties.panel
    b {voc.position}:
    .aPoint2DInput.compact.wide
        label
            span X:
            |
            input.compact(
                step="8" type="number"
                oninput="{wire('this.opts.copy.x')}"
                value="{opts.copy.x}"
            )
        .spacer
        label
          span.nogrow Y:
          |
          input.compact(
                step="8" type="number"
                oninput="{wire('this.opts.copy.y')}"
                value="{opts.copy.y}"
            )
    b {voc.scale}:
    .aPoint2DInput.compact.wide
        label
            span X:
            |
            input.compact(
                step="0.1" type="number"
                oninput="{wire('this.opts.copy.tx')}"
                value="{opts.copy.tx === void 0 ? 1 : opts.copy.tx}"
            )
        .spacer
        label
            span.nogrow Y:
            |
            input.compact(
                step="0.1" type="number"
                oninput="{wire('this.opts.copy.ty')}"
                value="{opts.copy.ty === void 0 ? 1 : opts.copy.ty}"
            )
    b {voc.rotation}:
    dd
        .flexrow
            .aSliderWrap
                input.compact(
                    type="range" min="0" max="360" step="1"
                    value="{opts.copy.tr || 0}"
                    oninput="{wire('this.opts.copy.tr')}"
                )
            .spacer
            input.compact(
                min="0" max="360" step="1" type="number"
                value="{opts.copy.tr || 0}"
                oninput="{wire('this.opts.copy.tr')}"
            )
    extensions-editor(entity="{opts.copy.exts}" type="copy" compact="yes" wide="yup")
    script.
        this.namespace = 'roomview.copyProperties';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);