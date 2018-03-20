graphic-selector.panel.view
    //- Возвращает объект выбранной графики или -1, если была выбрана пустая графика.
    //- Пустую графику можно выбрать только при наличии атрибута showempty
    ul.cards
        li(if="{opts.showempty}" onclick="{onselected(-1)}")
            span {window.languageJSON.common.none}
            img(src="/img/nograph.png")
        li(each="{graphic in window.currentProject.graphs}" onclick="{onselected(graphic)}")
            span {graphic.name}
            img(src="file://{sessionStorage.projdir + '/img/' + graphic.origname + '_prev.png'}")
    script.
        this.onselected = this.opts.onselected;
        this.namespace = 'common';
        this.mixin(window.riotVoc);