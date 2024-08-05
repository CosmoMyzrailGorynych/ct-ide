main-menu-latest-projects
    h1 {voc.recentProjects}
    ul.aMenu
        li(each="{project in latestProjects}" title="{project}" onclick="{() => loadLatestProject(project)}")
            span {project}
    script.
        this.namespace = 'mainMenu.latestProjects';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.refreshLatestProjects = function refreshLatestProjects() {
            if (('lastProjects' in localStorage) &&
                (localStorage.lastProjects !== '')) {
                this.latestProjects = localStorage.lastProjects.split(';');
                this.latestProjects.length = Math.min(this.latestProjects.length, 10);
            } else {
                this.latestProjects = [];
            }
        };
        this.refreshLatestProjects();

        this.loadLatestProject = projPath => {
            alertify.confirm(this.vocGlob.reallyExitConfirm)
            .then(e => {
                if (e) {
                    const {openProject} = require('src/lib/resources/projects');
                    window.signals.trigger('resetAll');
                    openProject(projPath);
                }
            });
        };
