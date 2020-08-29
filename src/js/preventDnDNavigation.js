/*
 * This file prevents opening an image or such when a file was dragged into
 * ct.js window and it was not catched by other listeners
 */

{
    const draghHandler = function draghHandler(e) {
        if (e.target.nodeName === 'INPUT' && e.target.type === 'file') {
            return;
        }
        e.preventDefault();
    };
    document.addEventListener('dragenter', draghHandler);
    document.addEventListener('dragover', draghHandler);
    document.addEventListener('drop', draghHandler);
}
