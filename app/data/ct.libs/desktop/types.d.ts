/**
 * A module that provides useful desktop-specific features,
 * such as manipulating the window, toggling the debugger/devtools, and more!
 */
declare namespace desktop {
    /**
     * Validate environment and run framework-specific methods
     */
    function desktopFeature(feature: {
        name: string,
        parameter?: string,
        nw: {
            namespace: string,
            method?: string,
            parameter?: string
        },
        electron: {
            namespace: string,
            method?: string,
            parameter?: string
        },
        neutralino: {
            namespace: string,
            method?: string,
            parameter?: string
        }
    }): unknown;
    /**
     * Open the built-in developer tools pannel/debugger
     */
    function openDevTools(options?: {
        mode: 'left' | 'right' | 'bottom' | 'undocked' | 'detach',
        activate: boolean
    }): void;
    /**
     * Close the built-in developer tools pannel/debugger
     */
    function closeDevTools(): void;
    /**
     * Check whether or not the built-in developer tools pannel/debugger is open
     */
    function isDevToolsOpen(): boolean;
    /**
     * Restarts the game and opens developer tools after that.
     */
    function restartWithDevtools(): void;
    /**
     * Close the game
     */
    function quit(): void;
    /**
     * Show and focus onto the window
     */
    function show(): void;
    /**
     * Hide the window
     */
    function hide(): void;
    /**
     * Check whether or not the window is visible
     */
        function isVisible(): Promise<boolean>;
    /**
     * Maximize the window; and also show (but not focus) the window if it isn't already visible
     */
    function maximize(): void;
    /**
     * Unmaximize the window
     */
    function unmaximize(): void;
    /**
     * Check whether or not the window is maximized
     */
        function isMaximized(): Promise<boolean>;
    /**
     * Minimize the window
     */
    function minimize(): void;
    /**
     * Restore the window to its previous state
     */
    function restore(): void;
    /**
     * Check whether or not the window is minimized
     */
    function isMinimized(): Promise<boolean>;
    /**
     * Enter fullscreen mode
     */
    function fullscreen(): void;
    /**
     * Leave fullscreen mode
     */
    function unfullscreen(): void;
    /**
     * Check whether or not the window is fullscreen
     */
    function isFullscreen(): Promise<boolean>;
    /**
     * Whether or not the game is running as a desktop app
     */
    var isDesktop: boolean;
    /**
     * Whether or not the game is running as a desktop app using NW.js
     */
    var isNw: boolean;
    /**
     * Whether or not the game is running as a desktop app using Electron
     */
    var isElectron: boolean;
}
