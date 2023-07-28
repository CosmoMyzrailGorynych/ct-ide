create-asset-menu.relative.inlineblock
    button(onclick="{showMenu}")
        svg.feather
            use(xlink:href="#plus")
        span  {parent.voc.newAsset}
    context-menu(menu="{menu}")
    script.
        const {assetTypes, resourceToIconMap, resourceTypes} = require('./data/node_requires/resources');
        this.showMenu = () => {
            this.showingMenu = true;
        };

        this.menu = {
            opened: false,
            items: []
        };
