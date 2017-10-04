graphic-selector.panel.view
    //- Возвращает объект выбранной графики или -1, если была выбрана пустая графика.
    //- Пустую графику можно выбрать только при наличии атрибута showempty
    ul.cards
        li(if="{opts.showempty}" onclick="{opts.onselected(-1)}")
            span {window.languageJSON.common.none}
            img(src="/img/nograph.png")
        li(each="{graphic in window.currentProject.graphs}" onclick="{opts.onselected(graphic)}")
            span {graphic.name}
            img(src="{sessionStorage.projdir + '/img/' + graphic.origname + '_prev.png'}")
