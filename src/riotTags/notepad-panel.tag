notepad-panel#notepad.panel.dockright(class="{opened: opened}")
    ul.nav.tabs.nogrow
        li(onclick="{changeTab('notepadlocal')}")
            i.icon.icon-edit
            span {voc.local}
        li(onclick="{changeTab('notepaglobal')}")
            i.icon.icon-clipboard
            span {voc.global}
        li(onclick="{changeTab('helppages')}")
            i.icon.icon-life-buoy
            span {voc.helppages}
    div
        div(show="{tab === 'notepadlocal'}")
            .acer(ref="notepadlocal")
        div(show="{tab === 'notepaglobal'}")
            .acer(ref="notepadglobal")
        div(show="{tab === 'helppages'}")
            iframe(src="https://docs.ctjs.rocks/" nwdisable nwfaketop)

    button.vertical.dockleft(onclick="{notepadToggle}")
        i.icon(class="icon-{opened? 'chevron-right' : 'chevron-left'}")
    script.
        this.opened = false;
        this.namespace = 'notepad';
        this.mixin(window.riotVoc);
        this.notepadToggle = function() {
            this.opened = !this.opened;
        };
        
        this.tab = 'notepadlocal';
        this.changeTab = tab => e => {
            this.tab = tab;
        };
        
        this.on('update', () => {
            this.notepadlocal.setValue(window.currentProject.notes || '');
        });
        
        this.on('mount', () => {
            setTimeout(() => {
                this.notepadlocal = window.setupAceEditor(this.refs.notepadlocal, {
                    mode: 'javascript'
                });
                this.notepadglobal = window.setupAceEditor(this.refs.notepadglobal, {
                    mode: 'javascript'
                });
                
                this.notepadlocal.getSession().on('change', (e) => {
                    window.currentProject.notes = this.notepadlocal.getValue();
                    window.glob.modified = true;
                });
                this.notepadglobal.getSession().on('change', (e) => {
                    localStorage.notes = this.notepadglobal.getValue();
                });
                this.notepadglobal.setValue(localStorage.notes);
            }, 0);
        });
