room-events-editor.view.panel
    .tabwrap
        ul.tabs.nav.nogrow.noshrink
            li(data-tab="#roomcreate" data-event="roomoncreate" data-tab-default)
                i.icon.icon-lamp
                span #{roomview.create}
            li(data-tab="#roomstep" data-event="roomonstep")
                i.icon.icon-timer
                span #{roomview.step}
            li(data-tab="#roomdraw" data-event="roomondraw")
                i.icon.icon-brush
                span #{roomview.draw}
            li(data-tab="#roomleave" data-event="roomonleave")
                i.icon.icon-exit
                span #{roomview.leave}
        div(style="position: relative;")
            #roomcreate.tabbed
                #roomoncreate.acer(data-mode="javascript" data-acervar="roomoncreate")
            #roomstep.tabbed
                #roomonstep.acer(data-mode="javascript" data-acervar="roomonstep")
            #roomdraw.tabbed
                #roomondraw.acer(data-mode="javascript" data-acervar="roomondraw")
            #roomleave.tabbed
                #roomonleave.acer(data-mode="javascript" data-acervar="roomonleave")
    button.wide.nogrow.noshrink(data-event="roomSaveEvents")
        i.icon.icon-confirm
        span #{roomview.done}
