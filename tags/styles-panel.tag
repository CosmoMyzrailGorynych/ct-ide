styles-panel
    button#stylecreate(onclick="styleCreate")
        i.icon.icon-lamp
        span {voc.create}
    ul.cards
        li(each="{style in window.currentProject.styles}")
            span {style.name}
            img(src="{window.sessionStorage.projdir + '/img/s' + style.uid + '.png'}")
    style-editor(if="{editingStyle}" styleobj="{editedStyle}")
    script.
        this.editingStyle = false;
        this.voc = window.languageJSON.styles
        this.styleCreate = () => {
            window.currentProject.styletick ++;
            var obj = {
                name: "style" + window.currentProject.styletick,
                shadow: false,
                stroke: false,
                fill: false,
                font: false,
                uid: window.currentProject.styletick
            };
            window.currentProject.styles.push(obj);
            this.editedStyle = obj;
            this.editingStyle = true;
        };
