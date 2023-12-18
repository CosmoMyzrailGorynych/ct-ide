//
    @attribute onselect (riot function)
        This function is called when a template is selected.
        The only argument passed to this function is the selected template.
    @attribute selectedtemplate (ITemplate | -1)
        Currently selected template, piped back from the room editor
room-template-picker
    asset-browser(
        collection="{currentProject.templates}"
        namespace="roomTemplates"
        assettypes="template"
        forcelayout="list"
        click="{selectTemplate}"
        thumbnails="{thumbnails}"
        compact="true"
        shownone="true"
        selectedasset="{opts.selectedtemplate}"
    )
    script.
        this.thumbnails = require('./data/node_requires/resources/templates').getTemplatePreview;
        this.selectTemplate = template => () => {
            this.opts.onselect(template);
        };
