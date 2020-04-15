// Set the correct zoom
(function () {
    const {webFrame} = require('electron');
    if (webFrame.getZoomFactor() !== Number(localStorage.editorZooming || 1)) {
        webFrame.setZoomFactor(Number(localStorage.editorZooming || 1));
    }
})();
