//
    @attribute pixieditor (RoomEditor)
        The reference to the current pixi editor

    @attribute ontransformchange (riot function)
        This function is called when this widget makes transformation
        changes to selected objects. Used to update the selection box.

    @method applyChanges
        Call this on selection change to apply changes to the current selection
    @method updatePropList
        Call this on selection change to re-scan the selection for values

room-entities-properties
    div(if="{opts.pixieditor?.currentSelection.size && changes}")
        // Basic properties
        virtual(if="{opts.pixieditor?.currentSelection.size && changes}" each="{prop in basicProps}")
            b {voc.copyProperties[prop.vocKey]}:
            // Point2D
            .aPoint2DInput.compact.wide(if="{prop.type === 'xy'}")
                label.flexrow
                    span.nogrow X:
                    input.nmr(
                        type="number"
                        oninput="{wireAndApply('this.changes.basic.' + prop.key + '.x')}"
                        onchange="{memorizeChanges}"
                        value="{changes.basic[prop.key].x}"
                        placeholder="{String(changes.basic[prop.key].x)}"
                        step="{prop.step}"
                    )
                .aSpacer.noshrink.nogrow
                label.flexrow
                    span.nogrow Y:
                    input.nmr(
                        type="number"
                        oninput="{wireAndApply('this.changes.basic.' + prop.key + '.y')}"
                        onchange="{memorizeChanges}"
                        value="{changes.basic[prop.key].y}"
                        placeholder="{String(changes.basic[prop.key].y)}"
                        step="{prop.step}"
                    )
            .flexrow(if="{prop.type === 'slider'}")
                .aSliderWrap
                    input.compact(
                        type="range" min="{prop.from}" max="{prop.to}" step="{prop.step}"
                        value="{(changes.basic[prop.key] === parent.multipleType) ? 0 : (changes.basic[prop.key] || 0)}"
                        oninput="{wireAndApply('this.changes.basic.' + prop.key)}"
                        onchange="{memorizeChanges}"
                        list="{prop.datalist}"
                    )
                    .DataTicks(if="{prop.datalist}")
                        .aDataTick(each="{value in [-180, -90, 0, 90, 180]}" style="left: {(value + 180) / 3.6}%")
                .aSpacer
                input.compact(
                    min="{prop.from}" max="{prop.to}" step="{prop.step}" type="number"
                    value="{String(changes.basic[prop.key])}"
                    oninput="{wireAndApply('this.changes.basic.' + prop.key)}"
                    onchange="{memorizeChanges}"
                    placeholder="{String(changes.basic[prop.key])}"
                )
            color-input(
                if="{prop.type === 'color'}"
                color="{PIXI.utils.hex2string(changes.basic[prop.key])}"
                onchange="{writeColor(prop.key)}"
                onapply="{writeColorAndMemorize(prop.key)}"
                hidealpha="true"
            )

        // Copies' extensions that come from mods
        extensions-editor(show="{hasCopies}" entity="{changes.exts}" ref="exts" type="copy" compact="yes" wide="yup")

        // Custom properties for copies
        div(if="{hasCopies}")
            h3 {voc.customProperties}
            table.wide.aPaddedTable.dense.cellsmiddle(if="{changes?.customProps && Object.entries(changes.customProps).length}")
                tr
                    th {voc.copyCustomProperties.property}
                    th {voc.copyCustomProperties.value}
                    th
                tr(each="{val, prop in changes.customProps}")
                    td
                        input.wide(
                            type="text"
                            value="{prop}"
                            onchange="{renameProp}"
                        )
                        p.anErrorNotice(if="{reservedProps.includes(prop)}") {voc.copyCustomProperties.nameOccupied}
                    td
                        input.wide(
                            type="text"
                            value="{val === multipleType ? '' : JSON.stringify(val)}"
                            placeholder="{val === multipleType ? String(multipleType) : ''}"
                            onchange="{changeValue}"
                        )
                    td
                        button.toright.square.inline.nm(onclick="{deleteCustomProperty(prop)}" title="{vocGlob.delete}")
                            svg.feather
                                use(xlink:href="#trash")
                        .clear
            button.nogrow(onclick="{addCustomProperty}")
                svg.feather
                    use(xlink:href="#plus")
                span {voc.copyCustomProperties.addProperty}
    datalist#theDatalistDegrees
        option(value="-180")
        option(value="-90")
        option(value="0")
        option(value="90")
        option(value="180")
    script.
        this.namespace = 'roomView';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        const {Copy} = require('./data/node_requires/roomEditor/entityClasses/Copy');

        this.changes = false;

        this.basicProps = [{
            // An i18n key to look for in roomView.copyProperties, for a label
            vocKey: 'position',
            // A key to write to
            key: 'position',
            // The type of this field. `xy` stands for 2D point input
            type: 'xy',
            step: 8
        }, {
            vocKey: 'scale',
            key: 'scale',
            type: 'xy',
            step: 0.1
        }, {
            vocKey: 'rotation',
            key: 'angle',
            type: 'slider',
            from: -180,
            to: 180,
            step: 1,
            datalist: 'theDatalistDegrees'
        }, {
            vocKey: 'opacity',
            key: 'alpha',
            type: 'slider',
            from: 0,
            to: 1,
            step: 0.01
        }, {
            vocKey: 'tint',
            key: 'tint',
            type: 'color'
        }];

        // Utilities for writing basic properties
        const typeWrap = (prop, entity) => {
            if (prop.type === 'xy') {
                return {
                    x: entity[prop.key].x,
                    y: entity[prop.key].y
                };
            }
            return entity[prop.key];
        };
        this.writeColor = key => (e, value) => {
            this.changes.basic[key] = PIXI.utils.string2hex(value);
            this.applyChanges();
        };
        this.wireAndApply = path => e => {
            this.wire(path)(e);
            this.applyChanges();
            this.opts.ontransformchange();
            e.stopPropagation();
        };

        const Magic = function Magic() {
            void 'sparkles';
        };
        Magic.prototype.toString = () => this.voc.copyProperties.multipleValues;
        Magic.prototype.toNumber = () => 0;
        this.multipleType = new Magic();

        this.firstRun = true;
        /**
         * Rescans the list of selected items and forms a list of matching and different properties.
         * Different changes are reflected as this.multipleType.
         *
         * Before the rescan, it always writes applied changes to the previous selection.
         */
        this.updatePropList = () => {
            this.firstRun = false;
            this.changes = {
                exts: {},
                basic: {},
                customProps: {}
            };

            this.hasCopies = false;
            const {basic} = this.changes;
            const selection = this.opts.pixieditor.currentSelection;
            // Quicker run for built-in properties
            for (const property of this.basicProps) {
                for (const entity of selection) {
                    if (!(property.key in basic)) {
                        basic[property.key] = typeWrap(property, entity);
                    } else if (property.type === 'xy') {
                        if (basic[property.key].x !== this.multipleType &&
                            basic[property.key].x !== entity[property.key].x
                        ) {
                            basic[property.key].x = this.multipleType;
                        }
                        if (basic[property.key].y !== this.multipleType &&
                            basic[property.key].y !== entity[property.key].y
                        ) {
                            basic[property.key].y = this.multipleType;
                        }
                        if (basic[property.key].x === this.multipleType &&
                            basic[property.key].y === this.multipleType
                        ) {
                            break;
                        }
                    } else if (basic[property.key] !== entity[property.key]) {
                        basic[property.key] = this.multipleType;
                        break;
                    }
                }
            }
            let copyCount = 0;
            const propCount = {};
            // Separate run for custom properties and extensions
            for (const entity of selection) {
                // Skip stuff that doesn't support custom properties
                if (!(entity instanceof Copy)) {
                    continue;
                }
                this.hasCopies = true;
                copyCount++;
                for (const property in entity.copyCustomProps) {
                    if (!(property in this.changes.customProps)) {
                        this.changes.customProps[property] = entity.copyCustomProps[property];
                        propCount[property] = 1;
                    } else if (this.changes.customProps[property] !== entity.copyCustomProps[property]) {
                        this.changes.customProps[property] = this.multipleType;
                        propCount[property]++;
                    } else {
                        propCount[property]++;
                    }
                }
            }
            // check if some copies did not have particular custom properties and mark such as (Multiple)
            for (const property in propCount) {
                if (propCount[property] !== copyCount) {
                    this.changes.customProps[property] = this.multipleType;
                }
            }
            this.update();
        };

        // an ID to use as newly created property names
        this.currentId = 1;
        this.renameProp = e => {
            const {prop, val} = e.item;
            const newName = e.target.value.trim();
            delete this.changes.customProps[prop];
            this.changes.customProps[newName] = val;
        };
        this.changeValue = e => {
            const {prop} = e.item;
            // attempt to parse the value
            // only strings will be unparsable with the JSON.parse method
            let trueValue;
            try {
                trueValue = JSON.parse(e.target.value); // JSON, number, boolean
            } catch {
                trueValue = e.target.value; // string
            }
            this.changes.customProps[prop] = trueValue;
        };
        this.addCustomProperty = () => {
            this.changes.customProps['newProperty' + this.currentId] = '';
            this.currentId++;
        };
        this.deleteCustomProperty = (prop) => () => {
            delete this.changes.customProps[prop];
            this.applyChanges();
        };

        this.reservedProps = [
            '_accessibleActive',
            '_accessibleDiv',
            '_bounds',
            '_boundsID',
            '_boundsRect',
            '_cachedTint',
            '_destroyed',
            '_enabledFilters',
            '_height',
            '_lastSortedIndex',
            '_localBounds',
            '_localBoundsRect',
            '_mask',
            '_tempDisplayObjectParent',
            '_tintedCanvas',
            '_width',
            '_zIndex',
            'accessible',
            'accessibleChildren',
            'accessibleHint',
            'accessiblePointerEvents',
            'accessibleTitle',
            'accessibleType',
            'alpha',
            'anchor',
            'angle',
            'animationSpeed',
            'autoUpdate',
            'blendMode',
            'buttonMode',
            'cacheAsBitmap',
            'children',
            'currentFrame',
            'cursor',
            'filterArea',
            'filters',
            'height',
            'hitArea',
            'interactive',
            'interactiveChildren',
            'isMask',
            'isSprite',
            'localTransform',
            'loop',
            'mask',
            'onComplete',
            'onFrameChange',
            'onLoop',
            'parent',
            'pivot',
            'playing',
            'pluginName',
            'position',
            'renderable',
            'rotation',
            'roundPixels',
            'scale',
            'skew',
            'sortableChildren',
            'sortDirty',
            'texture',
            'textures',
            'tint',
            'totalFrames',
            'transform',
            'updateAnchor',
            'visible',
            'width',
            'worldAlpha',
            'worldTransform',
            'worldVisible',
            'x',
            'y',
            'zIndex',
            'fromFrames',
            'fromImages',
            '_calculateBounds',
            '_onTextureUpdate',
            '_recursivePostUpdateTransform',
            '_render',
            'addChild',
            'addChildAt',
            'calculateBounds',
            'calculateTrimmedVertices',
            'calculateVertices',
            'containerUpdateTransform',
            'containsPoint',
            'destroy',
            'disableTempParent',
            'displayObjectUpdateTransform',
            'enableTempParent',
            'getBounds',
            'getChildAt',
            'getChildByName',
            'getChildIndex',
            'getGlobalPosition',
            'getLocalBounds',
            'gotoAndPlay',
            'gotoAndStop',
            'onChildrenChange',
            'play',
            'removeChild',
            'removeChildAt',
            'removeChildren',
            'render',
            'renderAdvanced',
            'renderAdvancedWebGL',
            'renderCanvas',
            'renderWebGL',
            'setChildIndex',
            'setParent',
            'setTransform',
            'sortChildren',
            'stop',
            'swapChildren',
            'toGlobal',
            'toLocal',
            'update',
            'updateTransform'
        ];

        this.applyChanges = () => {
            if (this.firstRun) {
                return;
            }
            const selection = this.opts.pixieditor.currentSelection || [];
            for (const entity of selection) {
                // basic properties are applied to everything
                for (const property in this.changes.basic) {
                    const value = this.changes.basic[property];
                    if (value === this.multipleType) {
                        continue;
                    }
                    const {type} = this.basicProps.find(prop => prop.key === property);
                    switch (type) {
                    case 'xy':
                        if (value.x !== this.multipleType) {
                            entity[property].x = value.x;
                        }
                        if (value.y !== this.multipleType) {
                            entity[property].y = value.y;
                        }
                        break;
                    case 'color':
                    case 'slider':
                        entity[property] = value;
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.error(`Ignoring unknown property type: ${type}`);
                        break;
                    }
                }
                // Extensions and custom properties are supported for copies only
                if (!(entity instanceof Copy)) {
                    continue;
                }
                // Write custom properties
                for (const property in this.changes.customProps) {
                    const value = this.changes.customProps[property];
                    if (value === this.multipleType) {
                        continue;
                    }
                    entity.copyCustomProps[property] = value;
                }
                // Custom properties that are missing from the changeset are removed
                for (const property in entity.copyCustomProps) {
                    if (!(property in this.changes.customProps)) {
                        delete entity.copyCustomProps[property];
                    }
                }
                // Write modded extensions
                if (!this.refs.exts) {
                    // Nothing to write
                    continue;
                }
                for (const extension in this.refs.exts.extensions) {
                    const value = this.changes.exts[extension.key];
                    if (value === this.multipleType) {
                        continue;
                    }
                    entity.copyExts[extension.key] = value;
                }
            }
        };
        this.memorizeChanges = () => {
            this.opts.pixieditor.history.snapshotTransforms();
        };
        this.writeColorAndMemorize = key => (e, value) => {
            this.writeColor(key)(e, value);
            this.opts.pixieditor.history.snapshotTransforms();
        };
