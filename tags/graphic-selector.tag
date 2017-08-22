graphic-selector.panel.view
    ul.cards
        li(
            each="{graphic in window.currentProject.graphs}"
            onclick="{opts.onselected(graphic)}"
        )
            span {graphic.name}
            img(src="{sessionStorage.projdir + '/img/' + graphic.origname + '_prev.png'}")
