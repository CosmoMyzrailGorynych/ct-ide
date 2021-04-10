//
    Shows a table of a copy's extensions object that is modifiable

    @attribute closestcopy (object)
        The copy to show its extensions object

    @attribute showme (function)
        A function that changes whether this modal is shown

copy-custom-properties-modal
    .panel.flexfix(ref="widget" style='overflow: auto; max-height: 600px')
        h2.flexfix-header {voc.customProperties}
        .flexfix-body
            table.wide.aPaddedTable
                tr
                    th {voc.property}
                    th {voc.value}
                    th
                tr(each="{val, prop in opts.closestcopy.exts}")
                    td
                        input.wide(name="copyCustomProp" type="text" value="{prop}" onchange="{onTableChange}")
                    td
                        input.wide(name="copyCustomValue" type="text" value="{JSON.stringify(val)}" onchange="{onTableChange}")
                    td
                        button.toright.square.inline(onclick="{deleteCustomProperty.bind(null, prop)}" title="{voc.delete}")
                            svg.feather
                                use(xlink:href="data/icons.svg#trash")
                        .clear
            p
        .flexrow.flexfix-footer
            .filler
            button.nogrow(onclick="{addCustomProperty}")
                svg.feather
                    use(xlink:href="data/icons.svg#plus")
                span {voc.addProperty}
            button.nogrow(onclick="{finished}")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {vocGlob.apply}
    script.
        this.namespace = 'copyCustomProperties';
        this.mixin(window.riotVoc);
        if (!this.opts.closestcopy.exts) {
            this.opts.closestcopy.exts = {};
        }
        // an ID to use as newly created property names
        this.currentId = 1;

        this.onTableChange = () => {
            // read all properties from the table
            var propElements = document.getElementsByName('copyCustomProp');
            var props = [];
            for (const prop of propElements) {
                props.push(prop.value);
            }

            // read all values from the table
            var valueElements = document.getElementsByName('copyCustomValue');
            var values = [];

            for (const value of valueElements) {
                // attempt to parse the value
                // only strings will be unparsable with the JSON.parse method
                var trueValue;
                try {
                    trueValue = JSON.parse(value.value); // JSON, number, boolean
                } catch {
                    trueValue = value.value; // string
                }
                values.push(trueValue);
            }

            var newExts = {};

            props.forEach((prop, index) => {
                newExts[prop] = values[index];
            });

            this.opts.closestcopy.exts = newExts;
        };

        this.addCustomProperty = () => {
            this.opts.closestcopy.exts['newProperty' + this.currentId] = '';
            this.currentId++;
        };

        this.deleteCustomProperty = (prop) => {
            delete this.opts.closestcopy.exts[prop];
        };

        this.finished = () => {
            this.opts.showme(false);
        };
