(function zoomSetup() {
    // Set the correct zoom
    const win = nw.Window.get();
    if (win.zoomLevel !== Number(localStorage.editorZooming || 0)) {
        win.zoomLevel = Number(localStorage.editorZooming || 0);
    }
})();
