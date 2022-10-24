(function windowMenuHelper() {
  const updateWindowMenu = async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 300));
    const allWindows = await (new Promise((resolve) => {
      nw.Window.getAll((windows) => {
        resolve(windows.map(win => {
          return {
            title: win.title,
            wid: win.cWindow.id,
            window: win
          }
        }));
      });
    }));
    const mb = new nw.Menu({ type:'menubar' });
    const appName = require('package.json').name;
    mb.createMacBuiltin(appName);
    const winMenu = mb.items[mb.items.length - 1].submenu;
    winMenu.append(new nw.MenuItem({ type: 'separator' }));
    const thisWindow = nw.Window.get();
    allWindows.forEach(win => {
      winMenu.append(new nw.MenuItem({
        type: 'checkbox',
        checked: thisWindow.cWindow.id === win.wid,
        label: `${win.title.replace(/ •$/, '')}`,
        click: () => win.window.focus()
      }));
    });
    thisWindow.menu = mb;
  };

  if (navigator.platform.indexOf('Mac') > -1) {
    updateWindowMenu();
    nw.Window.get().on('focus', updateWindowMenu);
    window.updateWindowMenu = updateWindowMenu;
  }
})();
