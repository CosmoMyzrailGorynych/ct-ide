stylebook-panel.aPanel.aView.pad.flexrow
    aside.nogrow.noshrink
        ul.aNav.vertical.nbr
            li(onclick="{openTab('common')}" class="{active: tab === 'common'}")
                svg.feather
                    use(xlink:href="#code")
                span Common styles
            li(onclick="{openTab('typography')}" class="{active: tab === 'typography'}")
                svg.feather
                    use(xlink:href="#font")
                span Typography
            li(onclick="{openTab('inputs')}" class="{active: tab === 'inputs'}")
                svg.feather
                    use(xlink:href="#ui")
                span Inputs
            li(onclick="{openTab('buildingBlocks')}" class="{active: tab === 'buildingBlocks'}")
                svg.feather
                    use(xlink:href="#grid")
                span Building blocks
            li(onclick="{openTab('tables')}" class="{active: tab === 'tables'}")
                svg.feather
                    use(xlink:href="#table-sidebar")
                span Tables
            li(onclick="{openTab('cursor')}" class="{active: tab === 'cursor'}")
                svg.feather
                    use(xlink:href="#ui")
                span Cursor


    main.aPanel.pad.tall(if="{tab === 'common'}")
        h1 Common styles
        .aSpacer
        stylebook-section(heading="Theme colors as text colors")
            yield(to="example")
                .act "act" Color
                .accent1 "accent1" Color
                .error "error" Color
                .success "success" Color
                .warning "warning" Color
                .text "text" Color
        stylebook-section(heading="Borders")
            yield(to="example")
                p.borderall All borders
                p.borderleft Left border
                p.borderright Right border
                p.bordertop Top border
                p.borderbottom Bottom border
        stylebook-section(heading="Wide class")
            yield(to="example")
                button A regular button
                p
                button.wide A wide button
        stylebook-section(heading="Short class")
            yield(to="example")
                input(type="text" value="Long text")
                p
                input(type="text" value="Short text").short
        stylebook-section(heading="Striped background")
            yield(to="description")
                p This class was created for use in this stylebook, but may be used elsewhere as well.
            yield(to="example")
                .aPanel.stripedbg.pad
                    p Some content
        stylebook-section(heading="Flex wrappers")
            yield(to="example")
                .flexrow
                    button A button
                    button A button
                    button A button
                p
                .flexcol
                    button A button
                    button A button
                    button A button
        stylebook-section(heading="Flex wrapper with fixed header and footer, but scrollable content")
            yield(to="example")
                .flexfix(style="max-height: 15rem")
                    .flexfix-header
                        h2 Some header
                    .flexfix-body
                        p Long text.
                        p Long text.
                        p Long text.
                        p Long text.
                        p Long text.
                        p Long text.
                    .flexfix-footer
                        button
                            svg.feather
                                use(xlink:href="#check")
                            span A button
        stylebook-section(heading="Padding modifiers")
            yield(to="example")
                button.np A button with no padding
                p
                button.npt A button with no top padding
                p
                button.npr A button with no right padding
                p
                button.npb A button with no bottom padding
                p
                button.npl A button with no left padding
        stylebook-section(heading="Border modifiers")
            yield(to="example")
                button.nb A button with no borders
                p
                button.nbt A button with no top border
                p
                button.nbr A button with no right border
                p
                button.nbb A button with no bottom border
                p
                button.nbl A button with no left border
        stylebook-section(heading="Margin modifiers")
            yield(to="example")
                p.nm A p with no margins
                p.nmt A p with no top margin
                p.nmr A p with no right margin
                p.nmb A p with no bottom margin
                p.nml A p with no left margin
        stylebook-section(heading="Float modifiers")
            yield(to="example")
                button.toright float: right
                button.toleft float: left
                button.nofloat float: none
        stylebook-section(heading="Text alignment classes")
            yield(to="example")
                p.center An example text.
                p.right An example text.
                p.left An example text.
        stylebook-section(heading="\"Round\" class")
            yield(to="example")
                button.square.round
                    svg.feather
                        use(xlink:href="#check")
                p
                button.round
                    span Why
        stylebook-section(heading="Display mode overrides")
            yield(to="example")
                div.inline An inline div.
                span A regular span.
                span.block A blocky span.
                div.inlineblock An inline-block div.
                div.inlineblock An inline-block div.
    main.aPanel.pad.tall(if="{tab === 'typography'}")
        h1 Typography
        .aSpacer
        stylebook-section(heading="Headings")
            yield(to="example")
                h1 An example of h1
                h2 An example of h2
                h3 An example of h3
                h4 An example of h4
                p h5 and h6 are not really used.
        stylebook-section(heading="CSS font-size modifiers")
            yield(to="example")
                p.big A big paragraph.
                p.small A small paragraph.
                p.tiny A tiny paragraph.
                p.rem A paragraph of 1rem size.
        stylebook-section(heading="Links")
            yield(to="example")
                a(href="https://ctjs.rocks/") A link.
                br
                .a A fake link.
                br
                a.error(href="https://ctjs.rocks/") An error link.
                br
                a.success(href="https://ctjs.rocks/") A success link.
                br
                a.warning(href="https://ctjs.rocks/") A warning link.
        stylebook-section(heading="Monospace text")
            yield(to="example")
                .monospace A line of text in a monospace typeface
        stylebook-section(heading="Code blocks")
            yield(to="example")
                pre
                    code.
                        Hey look, code!
        stylebook-section(heading="Inline code")
            yield(to="example")
                | This is an
                code.inline inline
                | code.
        stylebook-section(heading="Dimmed elements")
            yield(to="example")
                .dim Simply drops the opacity of an element to 50%
        stylebook-section(heading="Notices")
            yield(to="example")
                .aNotice Notices are more bleak and are written in italic.
        stylebook-section(heading="Cropped text with ellipsis")
            yield(to="example")
                .crop Yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada
        stylebook-section(heading="Contrasting plaques" stripedbg="yes")
            yield(to="example")
                .aContrastingPlaque Use these on colored or contrasting backgrounds.


    main.aPanel.pad.tall(if="{tab === 'inputs'}")
        h1 Inputs
        .aSpacer
        stylebook-section(heading="Generic inputs")
            yield(to="example")
                input(type="text" value="A simple input")
                p
                input.compact(type="number" value="0.5")
                p
                input.wide(type="url" value="https://ctjs.rocks/wide-inputs")
                p
                input.invalid(type="password" value="secrets")
                p
                input(type="range" value="30" min="0" max="100")
                p
                select
                    option Option 1
                    option Option 2
                    option Option 3
                p
                textarea Wheee
        stylebook-section(heading="Checkbox & radio inputs")
            yield(to="example")
                label.checkbox
                    input(type="checkbox")
                    span A label for a checkbox
                label.checkbox
                    input(type="checkbox" checked="checked")
                    span A label for a checkbox
                label.checkbox
                    input(type="radio")
                    span A label for a radio button
                label.checkbox
                    input(type="radio" checked="checked")
                    span A label for a radio button
                label.checkbox
                    input(type="radio")
                    span A label for a radio button
        stylebook-section(heading="Search form")
            yield(to="example")
                .aSearchWrap
                    input(type="text")
                    svg.feather
                        use(xlink:href="#search")
        stylebook-section(heading="Double/2D point input")
            yield(to="example")
                .aPoint2DInput.compact
                    label
                        span X:
                        input(type="number")
                    .aSpacer
                    label
                        span Y:
                        input(type="number")
                p
                .aPoint2DInput
                    label
                        span X:
                        input(type="number")
                    .aSpacer
                    label
                        span Y:
                        input(type="number")
                p
                .aPoint2DInput.wide
                    label
                        span X:
                        input(type="number")
                    .aSpacer
                    label
                        span Y:
                        input(type="number")
        stylebook-section(heading="[type=\"range\"] inputs with data ticks and wrappers")
            yield(to="example")
                .aSliderWrap
                    input(type="range" value="30" min="0" max="100")
                .aSliderWrap
                    input(type="range" value="30" min="0" max="100")
                    .DataTicks
                        .aDataTick(style="left: 0")
                        .aDataTick(style="left: 25%")
                        .aDataTick(style="left: 50%")
                        .aDataTick(style="left: 75%")
                        .aDataTick(style="right: 0")
        stylebook-section(heading="Buttons")
            yield(to="example")
                button A simple button
                button
                    svg.feather
                        use(xlink:href="#ui")
                    span A button with an icon
                button
                    svg.feather
                        use(xlink:href="#ui")
                p
                .button A fake button
                p
                button.wide A wide button
        stylebook-section(heading="Additional button forms")
            yield(to="example")
                button.inline An inline button
                button.inline
                    svg.feather
                        use(xlink:href="#ui")
                    span An inline button with an icon
                button.inline
                    svg.feather
                        use(xlink:href="#ui")
                p
                // These are to be used with icons only
                button.square
                    svg.feather
                        use(xlink:href="#ui")
                    span A squared button with an icon
                button.square
                    svg.feather
                        use(xlink:href="#ui")
                p
                button.square.inline
                    svg.feather
                        use(xlink:href="#ui")
                button.inline.square
                    svg.feather
                        use(xlink:href="#ui")
                    span An inline & squared button with an icon
                p
                button.tiny
                    svg.feather
                        use(xlink:href="#ui")
                button.tiny
                    svg.feather
                        use(xlink:href="#ui")
                    span A tiny button
                p
                button.vertical
                    svg.feather
                        use(xlink:href="#ui")
                button.vertical
                    svg.feather
                        use(xlink:href="#ui")
                    span A vertical button
        stylebook-section(heading="Forced background for buttons" stripedbg="yes")
            yield(to="example")
                button.forcebackground A simple button
                button.forcebackground
                    svg.feather
                        use(xlink:href="#ui")
                    span A button with an icon
                button.forcebackground
                    svg.feather
                        use(xlink:href="#ui")
        stylebook-section(heading="Button states")
            yield(to="example")
                button
                    svg.feather
                        use(xlink:href="#ui")
                    span A regular button
                button.active
                    svg.feather
                        use(xlink:href="#ui")
                    span An active button
                button.selected
                    svg.feather
                        use(xlink:href="#ui")
                    span A selected button
        stylebook-section(heading="Button groups")
            yield(to="example")
                .aButtonGroup
                    button A simple button
                    button.selected
                        svg.feather
                            use(xlink:href="#ui")
                        span A button with an icon
                    button
                        svg.feather
                            use(xlink:href="#ui")
                p
                .aButtonGroup.wide
                    button A simple button
                    button.selected
                        svg.feather
                            use(xlink:href="#ui")
                        span A button with an icon
                    button
                        svg.feather
                            use(xlink:href="#ui")
        stylebook-section(heading="Big power button")
            yield(to="example")
                .bigpower
                    svg.feather
                        use(xlink:href="#check")
                    span
                .bigpower.off
                    svg.feather
                        use(xlink:href="#x")
                    span
        stylebook-section(heading="Sneaky file input")
            yield(to="example")
                label.file.inlineblock
                    input(type="file")
                    .button
                        svg.feather
                            use(xlink:href="#folder")
                        span Select file
        stylebook-section(heading="Actionable / Clickable icons")
            yield(to="example")
                svg.feather.anActionableIcon
                    use(xlink:href="#plus")
                svg.feather.anActionableIcon
                    use(xlink:href="#folder")
                svg.feather.anActionableIcon
                    use(xlink:href="#ui")
                svg.feather.anActionableIcon.error
                    use(xlink:href="#alert-circle")
                svg.feather.anActionableIcon.warning
                    use(xlink:href="#alert-triangle")
                svg.feather.anActionableIcon.success
                    use(xlink:href="#check")
        stylebook-section(heading="Fieldsets and labels")
            yield(to="example")
                fieldset
                    label.block
                        b Label 1.1:
                        br
                        input(type="text" value="Input")
                    label.block
                        b Label 1.2:
                        br
                        input(type="text" value="Input")
                fieldset
                    label.block
                        b Label 2.1:
                        br
                        input(type="text" value="Input")
                fieldset
                    label.block
                        b Label 3.1:
                        br
                        input(type="text" value="Input")
                    label.block
                        b Label 3.2:
                        br
                        input(type="text" value="Input")
        stylebook-section(heading="Draggers & Clickers")
            yield(to="example")
                .aClicker(style="width: 100px;")
                .aDragger(style="left: 0px;")
                .aDragger.selected(style="left: 100px;")


    main.aPanel.pad.tall(if="{tab === 'buildingBlocks'}")
        h1 Building blocks
        .aSpacer
        stylebook-section(heading="Panels")
            yield(to="example")
                .aPanel
                    span A regular panel.
                .aSpacer
                .aPanel.pad
                    span A padded panel.
                .aSpacer
                .aPanel.pad.success
                    span A padded panel with a success message.
                .aSpacer
                .aPanel.pad.warning
                    span A padded panel with a warning.
                .aSpacer
                .aPanel.pad.error
                    span A padded panel with an error message.
        stylebook-section(heading="Views")
            yield(to="example")
                .aSpacer
                .aSpacer
                .aSpacer
                .aSpacer
                .aSpacer
                .aView.pad
                    span Views are panels that stretch over its whole container and have a deeper background.
        stylebook-section(heading="Inset panels")
            yield(to="example")
                .aPanel.pad.npb
                    h2 A heading
                    p Some interesting (or not) content
                    .inset
                        button A button
        stylebook-section(heading="Modals & Dimmers")
            yield(to="description")
                p Here the #[code.inline .relative.pad] classes on the dimmer are added only to prevent the modal from overlaying the whole screen, and to add some borders around the modal. You won't usually use these two classes.
            yield(to="example")
                .aDimmer.relative.pad
                    button.aDimmer-aCloseButton
                        svg.feather
                            use(xlink:href="#x")
                    .aModal.pad.npb
                        h2 A heading
                        p Some interesting (or not) content
                        .inset
                            button A button
        stylebook-section(heading="A dimmer with a close button")
            yield(to="description")
            yield(to="example")
                .aDimmer.relative
                    button.aDimmer-aCloseButton
                        svg.feather
                            use(xlink:href="#x")
                    .aSpacer
                    .aSpacer
                    .aSpacer
                    .aSpacer
                    .aSpacer
        stylebook-section(heading="Striped lists")
            yield(to="example")
                ul.aStripedList
                    li Item 1.1
                    li Item 1.2
                    li Item 1.3
                ul.aStripedList
                    li Item 2.1
                    li Item 2.2
                    li Item 2.3
                    li Item 2.4
                    li Item 2.5
        stylebook-section(heading="Menus")
            yield(to="description")
                p Menus extend striped lists by adding hover and active states for their list items, as well as additional styles for their icons.
            yield(to="example")
                ul.aMenu
                    li
                        svg.feather.anActionableIcon
                            use(xlink:href="#grid")
                        span Item 1.1
                    li
                        svg.feather.anActionableIcon
                            use(xlink:href="#folder")
                        span Item 1.2
                    li
                        svg.feather.anActionableIcon
                            use(xlink:href="#ui")
                        span Item 1.3
                ul.aMenu
                    li Item 2.1
                    li Item 2.2
                    li Item 2.3
        stylebook-section(heading="Checkbox items in menus")
            yield(to="example")
                ul.aMenu
                    li.checkbox
                        input(type="checkbox")
                        span Item 2.1
                    li.checkbox
                        input(type="checkbox" checked)
                        span Item 2.2
                ul.aMenu
                    li.checkbox
                        input(type="radio")
                        span Item 2.3
                    li.checkbox
                        input(type="radio" checked)
                        span Item 2.3
                    li.checkbox
                        input(type="radio")
                        span Item 2.3
        stylebook-section(heading="Navigation bars / Tabs")
            yield(to="example")
                ul.aNav
                    li Tab 1
                    li Tab 2
                    li.active Tab 3
                    li Tab 4
                p
                ul.aNav
                    li
                        svg.feather
                            use(xlink:href="#texture")
                        span Tab 1
                    li.active
                        svg.feather
                            use(xlink:href="#coin")
                        span Tab 2
                    li
                        svg.feather
                            use(xlink:href="#room")
                        span Tab 3
                    li
                        svg.feather
                            use(xlink:href="#template")
                        span Tab 4
        stylebook-section(heading="Vertical navigation / tabs")
            yield(to="example")
                ul.aNav.vertical
                    li Tab 1
                    li Tab 2
                    li.active Tab 3
                    li Tab 4
                h3 Some heading will fit between them nicely
                ul.aNav.vertical
                    li
                        svg.feather
                            use(xlink:href="#texture")
                        span Tab 1
                    li.active
                        svg.feather
                            use(xlink:href="#coin")
                        span Tab 2
                    li
                        svg.feather
                            use(xlink:href="#room")
                        span Tab 3
                    li
                        svg.feather
                            use(xlink:href="#template")
                        span Tab 4
        stylebook-section(heading="Resource cards")
            yield(to="example")
                ul.Cards
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard.active
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
        stylebook-section(heading="Resource cards (list style)")
            yield(to="example")
                ul.Cards.list
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard.active
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
        stylebook-section(heading="Resource cards (big thumbnails style)")
            yield(to="example")
                ul.Cards.largeicons
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard.active
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
        stylebook-section(heading="Action buttons inside resource cards")
            yield(to="description")
                p Hover over the items to see the action buttons
            yield(to="example")
                ul.Cards
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                        .aCard-Actions
                            button.tiny
                                svg.feather
                                    use(xlink:href="#x")
                    li.aCard.active
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                        .aCard-Actions
                            button.tiny
                                svg.feather
                                    use(xlink:href="#x")
                    li.aCard
                        .aCard-aThumbnail
                            svg.feather
                                use(xlink:href="#template")
                        .aCard-Properties
                            span Resource name
                        .aCard-Actions
                            button.tiny
                                svg.feather
                                    use(xlink:href="#x")
        stylebook-section(heading="Progress bars")
            yield(to="description")
                p Width is set with CSS to the inner #[code.inline div] tag. Note that progress bars are inline-block elements.
            yield(to="example")
                .aProgressbar
                    div(style="width: 30%")
                p
                .aProgressbar.warning
                    div(style="width: 40%")
                p
                .aProgressbar.success
                    div(style="width: 50%")
                p
                .aProgressbar.error
                    div(style="width: 60%")
        stylebook-section(heading="Error notices")
            yield(to="description")
                p These have absolute positioning and are to be positioned with CSS.
            yield(to="example")
                .anErrorNotice There is an error that you should fix immediately!
        stylebook-section(heading="A pulser")
            yield(to="description")
                p A pulsating animation that positions itself in the center of the current layer.
            yield(to="example")
                .aPulser
        stylebook-section(heading="16:9 container")
            yield(to="description")
                p Takes an iframe, embed, or video tag and positions it so that it occupies all the available width while preserving perfect 16:9 proportions.
            yield(to="example")
                .aContainer16x9
                    iframe(src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0")

    main.aPanel.pad.tall(if="{tab === 'tables'}")
        h1 Tables
        .aSpacer
        stylebook-section(heading="Regular tables look poopy!")
            yield(to="description")
                p Don't use them.
            yield(to="example")
                table
                    tbody
                        tr
                            th Heading 1
                            th Heading 2
                            th Heading 3
                        tr
                            td Cell 1.1
                            td Cell 1.2
                            td Cell 1.3
                        tr
                            td Cell 2.1
                            td Cell 2.2
                            td Cell 2.3
        stylebook-section(heading="Padded tables")
            yield(to="description")
                p Padded tables add paddings to cells for readability but add little decoration
            yield(to="example")
                table.aPaddedTable
                    tbody
                        tr
                            th Heading 1
                            th Heading 2
                            th Heading 3
                        tr
                            td Cell 1.1
                            td Cell 1.2
                            td Cell 1.3
                        tr
                            td Cell 2.1
                            td Cell 2.2
                            td Cell 2.3
        stylebook-section(heading="Nice tables")
            yield(to="description")
                p Nice tables are fabulous 💅
            yield(to="example")
                table.aNiceTable
                    tbody
                        tr
                            th Heading 1
                            th Heading 2
                            th Heading 3
                        tr
                            td Cell 1.1
                            td Cell 1.2
                            td Cell 1.3
                        tr
                            td Cell 2.1
                            td Cell 2.2
                            td Cell 2.3
        stylebook-section(heading="Wide tables")
            yield(to="example")
                table.aPaddedTable.wide
                    tbody
                        tr
                            th Heading 1
                            th Heading 2
                            th Heading 3
                        tr
                            td Cell 1.1
                            td Cell 1.2
                            td Cell 1.3
                        tr
                            td Cell 2.1
                            td Cell 2.2
                            td Cell 2.3
                table.aNiceTable.wide
                    tbody
                        tr
                            th Heading 1
                            th Heading 2
                            th Heading 3
                        tr
                            td Cell 1.1
                            td Cell 1.2
                            td Cell 1.3
                        tr
                            td Cell 2.1
                            td Cell 2.2
                            td Cell 2.3
        stylebook-section(heading="Scrollable table wraps for long content")
            yield(to="example")
                .aTableWrap
                    table.aNiceTable
                        tbody
                            tr
                                th Heading 1
                                th Heading 2
                                th Heading 3
                                th Heading 4
                                th Heading 5
                                th Heading 6
                                th Heading 7
                                th Heading 8
                                th Heading 9
                            tr
                                td Cell 1.1
                                td Cell 1.2
                                td Cell 1.3
                                td Cell 1.4
                                td Cell 1.5
                                td Cell 1.6
                                td Cell 1.7
                                td Cell 1.8
                                td Cell 1.9
                            tr
                                td Cell 2.1
                                td Cell 2.2
                                td Cell 2.3
                                td Cell 2.4
                                td Cell 2.5
                                td Yadayadayadayadayadayadayadayada
                                td Cell 2.7
                                td Cell 2.8
                                td Cell 2.9
    main.aPanel.pad.tall(if="{tab === 'cursor'}")
        h1 Cursor styles
        .aSpacer
        stylebook-section()
            yield(to="description")
                p There are several styles that change the cursor hovering over the element.
            yield(to="example")
                p.pointer A paragraph that changes a cursor to a pointer.
                button A regular button
                p
                button.cursordefault A button that shows a default cursor instead of a pointer.
                p
                button.loading
                    svg.feather.rotate
                        use(xlink:href="#refresh-cw")
                    span A button with a "wait" cursor
                p
                button.cursorhelp
                    span A button with a "help" cursor
    .aSpacer.nogrow
    .nogrow
        button.inline.square(onclick="{opts.onclose}" title="{vocGlob.close}")
            svg.feather
                use(xlink:href="#x")
    script.
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.tab = 'common';
        this.openTab = tab => () => {
            this.tab = tab;
        };
