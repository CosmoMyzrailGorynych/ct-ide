enum-editor.aView.pad
    h1 {asset.name}
    ul.aStripedList
        li(each="{value, ind in asset.values}")
            input(
                type="text" value="{value}" pattern="[a-zA-Z][a-zA-Z0-9]*"
                onchange="{wire('asset.values.' + ind)}" oninput="{updateValueName}" onkeyup="{tryCreateNewValue}"
                ref="inputs"
            )
            code.inline {getTypescriptEnumName()}.{value}
            .anActionableIcon(onclick="{copyVariantCode}" title="{vocGlob.copy}")
                svg.feather
                    use(xlink:href="#copy")
            .aSpacer.inlineblock
            .anActionableIcon(onclick="{removeVariant}")
                svg.feather.red
                    use(xlink:href="#delete")
    button(onclick="{addVariant}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.addVariant}
    p.dim {voc.enumUseCases}
    .aSpacer
    button(onclick="{applyChanges}")
        svg.feather
            use(xlink:href="#check")
        span {vocGlob.apply}
    script.
        this.namespace = 'enumEditor';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.mixin(require('src/lib/riotMixins/wire').default);
        this.mixin(require('src/lib/riotMixins/discardio').default);
        const {getTypescriptEnumName} = require('src/lib/resources/enums');
        this.getTypescriptEnumName = () => getTypescriptEnumName(this.asset);

        this.addVariant = () => {
            let nameInd = 1;
            while (this.asset.values.includes(`Variant${nameInd}`)) {
                nameInd++;
            }
            this.asset.values.push(`Variant${nameInd}`);
        };
        this.updateValueName = e => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').replace(/^[^a-zA-Z]/, '');
        };
        // Listens for Enter in the field to automatically create a new value
        this.tryCreateNewValue = e => {
            if (e.key === 'Enter') {
                this.addVariant();
                this.update();
                const inputs = Array.isArray(this.refs.inputs) ? this.refs.inputs : [this.refs.inputs];
                const input = inputs.pop();
                input.focus();
                input.select();
            }
        };
        this.copyVariantCode = e => {
            const {value} = e.item;
            navigator.clipboard.writeText(`${this.getTypescriptEnumName()}.${value}`);
        };
        this.removeVariant = e => {
            const {ind} = e.item;
            this.asset.values.splice(ind, 1);
        };
        this.saveAsset = () => {
            this.writeChanges();
            return true;
        };
        this.applyChanges = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };
