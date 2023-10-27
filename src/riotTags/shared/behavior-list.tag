//-
    @attribute asset (ITemplate|IRoom)
    @attribute onchanged (riot function)
behavior-list
    ul.aStripedList(if="{opts.asset.behaviors.length}")
        li.flexrow(each="{bhUid, ind in opts.asset.behaviors}")
            span {parent.getBehaviorName(bhUid)}
            .aSpacer.nogrow
            .nogrow.noshrink
                div.anActionableIcon(onclick="{parent.moveBehaviorUp}" style="{ind  === 0 ? 'opacity: 0;' : ''}")
                    svg.feather
                        use(xlink:href="#arrow-up")
                div.anActionableIcon(onclick="{parent.moveBehaviorDown}" style="{ind === parent.opts.asset.behaviors.length - 1 ? 'opacity: 0;' : ''}")
                    svg.feather
                        use(xlink:href="#arrow-down")
                div.anActionableIcon
                    svg.feather(onclick="{parent.openBehavior(bhUid)}")
                        use(xlink:href="#external-link")
                div.anActionableIcon
                    svg.feather(onclick="{parent.removeBehavior(bhUid)}")
                        use(xlink:href="#delete")
    button.wide(onclick="{openAddBehavior}")
        svg.feather
            use(xlink:href="#plus")
        span {vocGlob.addBehavior}
    asset-selector(
        if="{showAddBehavior}"
        assettypes="behavior"
        onselected="{addBehavior}"
        oncancelled="{closeAddBehavior}"
        customfilter="{assetFilter}"
    )
    script.
        this.namespace = 'behaviorList';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        const resources = require('./data/node_requires/resources');

        this.getBehaviorName = id => resources.getById('behavior', id).name;
        this.openBehavior = id => () => window.orders.trigger('openAsset', id);
        this.removeBehavior = id => () => this.opts.asset.behaviors
            .splice(this.opts.asset.behaviors.indexOf(id), 1);

        this.assetFilter = asset => asset.behaviorType === this.opts.asset.type &&
            !this.opts.asset.behaviors.includes(asset.uid);

        this.moveBehaviorUp = e => {
            const clickedBh = e.item.bhUid;
            const ind = this.opts.asset.behaviors.indexOf(clickedBh);
            if (ind === 0) {
                return;
            }
            const above = this.opts.asset.behaviors[ind - 1];
            this.opts.asset.behaviors.splice(ind - 1, 2, clickedBh, above);
            this.opts.onchanged();
        };
        this.moveBehaviorDown = e => {
            const clickedBh = e.item.bhUid;
            const ind = this.opts.asset.behaviors.indexOf(clickedBh);
            if (ind === this.opts.asset.behaviors.length - 1) {
                return;
            }
            const below = this.opts.asset.behaviors[ind + 1];
            this.opts.asset.behaviors.splice(ind - 1, 2, below, clickedBh);
            this.opts.onchanged();
        };
        this.showAddBehavior = false;
        this.openAddBehavior = () => {
            this.showAddBehavior = true;
        };
        this.addBehavior = uid => {
            this.opts.asset.behaviors.push(uid);
            this.closeAddBehavior();
            this.opts.onchanged();
        };
        this.closeAddBehavior = () => {
            this.showAddBehavior = false;
            this.update();
        };
