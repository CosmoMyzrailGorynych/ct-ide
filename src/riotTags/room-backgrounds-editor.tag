room-backgrounds-editor.room-editor-Backgrounds.tabbed.tall
    ul
        li.bg(each="{background, ind in opts.room.backgrounds}" oncontextmenu="{onContextMenu}")
            img(src="{background.graph === -1? '/img/nograph.png' : (glob.graphmap[background.graph].src.split('?')[0] + '_prev.png?' + Math.random())}" onclick="{onChangeBgGraphic}")
            span(onclick="{onChangeBgDepth}") {background.depth}

    button.inline.wide(onclick="{addBg}")
        i.icon-plus
        span {voc.add}
    graphic-selector(ref="graphPicker" if="{pickingBackground}" onselected="{onGraphSelected}")
    script.
        const gui = require('nw.gui');
        this.pickingBackground = false;
        this.namespace = 'roombackgrounds';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.onGraphSelected = graph => e => {
            this.editingBackground.graph = graph.uid;
            this.pickingBackground = false;
            this.update();
            this.parent.refreshRoomCanvas();
        };
        this.addBg = function () {
            var newBg = {
                depth: 0,
                graph: -1
            };
            this.opts.room.backgrounds.push(newBg);
            this.editingBackground = newBg;
            this.pickingBackground = true;
            this.opts.room.backgrounds.sort(function (a, b) {
                return a.depth - b.depth;
            });
            this.update();
        };
        this.onContextMenu = e => {
            this.editedBg = Number(e.item.ind);
            roomBgMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        var roomBgMenu = new gui.Menu();
        roomBgMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.delete,
            click: () => {
                this.opts.room.backgrounds.splice(this.editedBg, 1);
                this.parent.refreshRoomCanvas();
                this.update();
            }
        }));
        this.onChangeBgGraphic = e => {
            this.pickingBackground = true;
            this.editingBackground = e.item.background;
            this.update();
        };
        this.onChangeBgDepth = e => {
            alertify
            .defaultValue(e.item.background.depth)
            .prompt(window.languageJSON.roomview.newdepth)
            .then(ee => {
                if (ee.inputValue && Number(ee.inputValue)) {
                    e.item.background.depth = ee.inputValue;
                    this.opts.room.backgrounds.sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                    this.parent.refreshRoomCanvas();
                    this.update();
                }
            });
        };