// Set the correct zoom
(function () {
    const win = nw.Window.get();
    if (win.zoomLevel !== Number(localStorage.editorZooming || 0)) {
        win.zoomLevel = Number(localStorage.editorZooming || 0);
    }
})();
