## desktop.openDevTools(options)

- `options` object (optional)
  - `mode` string - Opens the devtools with specified dock state, can be `left`, `right`, `bottom`, `undocked`, or `detach`.
  - `activate` boolean (optional) - Whether to bring the opened devtools window to the foreground. The default is `true`.

Opens the built-in developer tools pannel/debugger

> ⚠️ This method is not supported on Neutralino.js framework (default ct.js framework for desktop builds).

### Example:

```javascript
if (aReasonToOpenDebugger === true) {
  desktop.openDevTools({ mode: "right" });
}
```

## desktop.closeDevTools()

Closes the built-in developer tools pannel/debugger

> ⚠️ This method is not supported on Neutralino.js framework (default ct.js framework for desktop builds).

### Example:

```javascript
if (aReasonToCloseDebugger === true) {
    desktop.closeDevTools();
}
```

## desktop.restartWithDevtools

Restarts the game and opens developer tools after that.

> ⚠️ This method is **only** supported on Neutralino.js framework (default ct.js framework for desktop builds).

## desktop.isDevToolsOpen()

Checks whether the built-in developer tools pannel/debugger is open

Returns `boolean`

> ⚠️ This method is not supported on Neutralino.js framework (default ct.js framework for desktop builds).

### Example:

```javascript
if (desktop.isDevToolsOpen() === true) {
    /* do something if devtools is open */
} else if (desktop.isDevToolsOpen() === false) {
    /* do something if devtools is not open */
}
```

## desktop.quit()

Closes the game

### Example:

```javascript
if (itsTimeToExitNow === true) {
    desktop.quit();
}
```

## desktop.show()

Shows and focuses on the window

### Example:

```javascript
if (reasonToFocusWindow === true) {
    desktop.show();
}
```

## desktop.hide()

Hides the window

### Warning:

`.hide()` will make the window completly invisible and will not show the window in any operating system menus (Although the app's process will still show in task manager) It will appear as if the app isnt open at all (even though it is actually running)

**It's nearly impossible to close the window when it's hidden, so make sure you use `.show()` later in your code to make sure the user can see your app!** The only way to close a window hidden with `.hide()` is to kill it's process.

### Example:

```javascript
if (timeToHide === true) {
    desktop.hide();
}
```

## desktop.isVisible()

Checks whether or not the window is visible

Returns a `Promise` that resolves into `boolean`.

### Example:

```javascript
desktop.isVisible().then(isVisible => {
    if (isVisible) {
        /* do something when the window is visible */
    } else {
        /* do something when the window is not visible */
    }
});
```

## desktop.maximize()

Maximizes the window; this will also show (but not focus) the window if it isn't already visible

### Example:

```javascript
if (maximizeMe === true) {
    desktop.maximize();
}
```

## desktop.unmaximize()

Unmaximizes the window

### Example

```javascript
if (maximizeMe === false) {
    desktop.unmaximize();
}
```

## desktop.isMaximized()

Checks whether or not the window is maximized

Returns a `Promise` that resolves into `boolean`.


### Example:

```javascript
desktop.isMaximized().then(isMaximized => {
    if (isMaximized) {
        /* do something when maximized */
    } else {
        /* do something when not maximized */
    }
});
```

## desktop.minimize()

Minimizes the window

### Example

```javascript
if (minimizeMe === true) {
    desktop.minimize();
}
```

## desktop.restore()

Restores the window from to its previous state

### Example

```javascript
if (reasonToResetWindow) {
    desktop.restore();
}
```

## desktop.isMinimized()

Checks whether or not the window is maximized

Returns a `Promise` that resolves into `boolean`.

### Example:

```javascript
desktop.isMinimized().then(isMinimized => {
    if (isMinimized) {
        /* do something when minimized */
    } else {
        /* do something when not minimized */
    }
});
```

## desktop.fullscreen()

Enters fullscreen mode

### Example

```javascript
if (BE_FULLSCREEN === true) {
    desktop.fullscreen();
}
```

## desktop.unfullscreen()

Leaves fullscreen mode

### Example

```javascript
if (BE_FULLSCREEN === false) {
    desktop.unfullscreen();
}
```

## desktop.isFullscreen()

Checks whether or not the window is fullscreen

Returns a `Promise` that resolves into a `boolean`.

### Example:

```javascript
desktop.isFullscreen().then(isFullscreen => {
    if (isFullscreen) {
        /* do something when in fullscreen mode */
    } else {
        /* do something when not in fullscreen mode */
    }
});
```

## desktop.isDesktop

Whether or not the game is running as a desktop app

### Example:

```javascript
if (desktop.isDesktop === true) {
    /* Do something only in the desktop app */
} else if (desktop.isDesktop === false) {
    /* Do something on all platforms other than desktop */
}
```

## desktop.isNw

Whether or not the game is running as a desktop app using NW.js

### Example:

```javascript
if (desktop.isNw === true) {
    /* Do something only in nw.js */
}
```

## desktop.isElectron

Whether or not the game is running as a desktop app using Electron

### Example:

```javascript
if (desktop.isElectron === true) {
    /* Do something only in Electron */
}
```

## desktop.desktopFeature(feature)

- `feature` object
  - `name` string
  - `parameter` string (optional) - Defaults to `undefined`
  - `nw` object - Options for NW.js
    - `namespace` string
    - `method` string (optional) - Defaults to `feature.name`
    - `parameter` string (optional) - Defaults to `feature.parameter`
  - `electron` object - Options for Electron
    - `namespace` string
    - `method` string (optional) - Defaults to `feature.name`
    - `parameter` string (optional) - Defaults to `feature.parameter`
  - `neutralino` object - Options for Neutralino.js
    - `namespace` string
    - `method` string (optional) - Defaults to `feature.name`
    - `parameter` string (optional) - Defaults to `feature.parameter`

Validates environment and runs framework-specific methods depending on detected environment and configured options

Returns `feature.nw.namespace[feature.nw.method](feature.nw.parameter)` or `feature.electron.namespace[feature.electron.method](feature.electron.parameter)`

(i.e. Returns the function defined in the `namespace` and `method` properties of the current environment)

### Example:

```javascript
desktop.desktopFeature({
    name: 'customDesktopStuff',
    parameter: someParameter,
    nw: {
        namespace: 'win.something',
        method: 'someNwFunction'
    },
    electron: {
        namespace: 'mainWindow.something',
        method: 'someElectronFunction'
    }
});
/* Will run win.something.someNwFunction('abc') on NW.js */
/* Will run mainWindow.something.someElectronFunction('abc') on Electron */
```
