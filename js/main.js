/**
    common variables:
        - currentProject

    Maps:
        - glob.typemap:  uid      --> type index
        - glob.graphmap: origname --> image
                                      image.g --> graph object

*/

// first-launch setup
if (!localStorage.fontSize) {
    localStorage.fontSize = 18;
    localStorage.lastProjects = '';
    localStorage.notes = '';
}

// bind f1
window.key('f1', function () {
    gui.Shell.openItem(exec + '/docs/index.html')
});
window.key('ctrl + S', function () {
    window.signals.trigger('saveProject');
});

setTimeout(() => {
    window.alertify.set({
        labels: {
            ok: window.languageJSON.common.ok,
            cancel: window.languageJSON.common.cancel
        }
    });
});
