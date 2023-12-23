// Type definitions for Neutralino 3.12.0
// Project: https://github.com/neutralinojs
// Definitions project: https://github.com/neutralinojs/neutralino.js

declare namespace Neutralino {

namespace filesystem {
    interface DirectoryEntry {
        entry: string;
        type: string;
    }
    interface FileReaderOptions {
        pos: number;
        size: number;
    }
    interface OpenedFile {
        id: number;
        eof: boolean;
        pos: number;
        lastRead: number;
    }
    interface Stats {
        size: number;
        isFile: boolean;
        isDirectory: boolean;
        createdAt: number;
        modifiedAt: number;
    }
    interface Watcher {
        id: number;
        path: string;
    }
    function createDirectory(path: string): Promise<void>;
    function removeDirectory(path: string): Promise<void>;
    function writeFile(path: string, data: string): Promise<void>;
    function appendFile(path: string, data: string): Promise<void>;
    function writeBinaryFile(path: string, data: ArrayBuffer): Promise<void>;
    function appendBinaryFile(path: string, data: ArrayBuffer): Promise<void>;
    function readFile(path: string, options?: FileReaderOptions): Promise<string>;
    function readBinaryFile(path: string, options?: FileReaderOptions): Promise<ArrayBuffer>;
    function openFile(path: string): Promise<number>;
    function createWatcher(path: string): Promise<number>;
    function removeWatcher(id: number): Promise<number>;
    function getWatchers(): Promise<Watcher[]>;
    function updateOpenedFile(id: number, event: string, data?: any): Promise<void>;
    function getOpenedFileInfo(id: number): Promise<OpenedFile>;
    function removeFile(path: string): Promise<void>;
    function readDirectory(path: string): Promise<DirectoryEntry[]>;
    function copyFile(source: string, destination: string): Promise<void>;
    function moveFile(source: string, destination: string): Promise<void>;
    function getStats(path: string): Promise<Stats>;
}
namespace os {
    interface ExecCommandOptions {
        stdIn?: string;
        background?: boolean;
        cwd?: string;
    }
    interface ExecCommandResult {
        pid: number;
        stdOut: string;
        stdErr: string;
        exitCode: number;
    }
    interface SpawnedProcess {
        id: number;
        pid: number;
    }
    interface Envs {
        [key: string]: string;
    }
    interface OpenDialogOptions {
        multiSelections?: boolean;
        filters?: Filter[];
        defaultPath?: string;
    }
    interface FolderDialogOptions {
        defaultPath?: string;
    }
    interface SaveDialogOptions {
        forceOverwrite?: boolean;
        filters?: Filter[];
        defaultPath?: string;
    }
    interface Filter {
        name: string;
        extensions: string[];
    }
    interface TrayOptions {
        icon: string;
        menuItems: TrayMenuItem[];
    }
    interface TrayMenuItem {
        id?: string;
        text: string;
        isDisabled?: boolean;
        isChecked?: boolean;
    }
    enum Icon {
        WARNING = "WARNING",
        ERROR = "ERROR",
        INFO = "INFO",
        QUESTION = "QUESTION"
    }
    enum MessageBoxChoice {
        OK = "OK",
        OK_CANCEL = "OK_CANCEL",
        YES_NO = "YES_NO",
        YES_NO_CANCEL = "YES_NO_CANCEL",
        RETRY_CANCEL = "RETRY_CANCEL",
        ABORT_RETRY_IGNORE = "ABORT_RETRY_IGNORE"
    }
    type KnownPath = "config" | "data" | "cache" | "documents" | "pictures" | "music" | "video" | "downloads" | "savedGames1" | "savedGames2";
    function execCommand(command: string, options?: ExecCommandOptions): Promise<ExecCommandResult>;
    function spawnProcess(command: string, cwd?: string): Promise<SpawnedProcess>;
    function updateSpawnedProcess(id: number, event: string, data?: any): Promise<void>;
    function getSpawnedProcesses(): Promise<SpawnedProcess[]>;
    function getEnv(key: string): Promise<string>;
    function getEnvs(): Promise<Envs>;
    function showOpenDialog(title?: string, options?: OpenDialogOptions): Promise<string[]>;
    function showFolderDialog(title?: string, options?: FolderDialogOptions): Promise<string>;
    function showSaveDialog(title?: string, options?: SaveDialogOptions): Promise<string>;
    function showNotification(title: string, content: string, icon?: Icon): Promise<void>;
    function showMessageBox(title: string, content: string, choice?: MessageBoxChoice, icon?: Icon): Promise<string>;
    function setTray(options: TrayOptions): Promise<void>;
    function open(url: string): Promise<void>;
    function getPath(name: KnownPath): Promise<string>;
}
namespace computer {
    interface MemoryInfo {
        total: number;
        available: number;
    }
    interface KernelInfo {
        variant: string;
        version: string;
    }
    interface OSInfo {
        name: string;
        description: string;
        version: string;
    }
    interface CPUInfo {
        vendor: string;
        model: string;
        frequency: number;
        architecture: string;
        logicalThreads: number;
        physicalCores: number;
        physicalUnits: number;
    }
    interface Display {
        id: number;
        resolution: Resolution;
        dpi: number;
        bpp: number;
        refreshRate: number;
    }
    interface Resolution {
        width: number;
        height: number;
    }
    interface MousePosition {
        x: number;
        y: number;
    }
    function getMemoryInfo(): Promise<MemoryInfo>;
    function getArch(): Promise<string>;
    function getKernelInfo(): Promise<KernelInfo>;
    function getOSInfo(): Promise<OSInfo>;
    function getCPUInfo(): Promise<CPUInfo>;
    function getDisplays(): Promise<Display[]>;
    function getMousePosition(): Promise<MousePosition>;
}
namespace storage {
    function setData(key: string, data: string): Promise<void>;
    function getData(key: string): Promise<string>;
    function getKeys(): Promise<string[]>;
}
namespace debug {
    enum LoggerType {
        WARNING = "WARNING",
        ERROR = "ERROR",
        INFO = "INFO"
    }
    function log(message: string, type?: LoggerType): Promise<void>;
}
namespace app {
    interface OpenActionOptions {
        url: string;
    }
    interface RestartOptions {
        args: string;
    }
    function exit(code?: number): Promise<void>;
    function killProcess(): Promise<void>;
    function restartProcess(options?: RestartOptions): Promise<void>;
    function getConfig(): Promise<any>;
    function broadcast(event: string, data?: any): Promise<void>;
}
namespace window {
    interface WindowOptions extends WindowSizeOptions, WindowPosOptions {
        title?: string;
        icon?: string;
        fullScreen?: boolean;
        alwaysOnTop?: boolean;
        enableInspector?: boolean;
        borderless?: boolean;
        maximize?: boolean;
        hidden?: boolean;
        maximizable?: boolean;
        useSavedState?: boolean;
        processArgs?: string;
    }
    interface WindowSizeOptions {
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        resizable?: boolean;
    }
    interface WindowPosOptions {
        x: number;
        y: number;
    }
    function setTitle(title: string): Promise<void>;
    function getTitle(): Promise<string>;
    function maximize(): Promise<void>;
    function unmaximize(): Promise<void>;
    function isMaximized(): Promise<boolean>;
    function minimize(): Promise<void>;
    function setFullScreen(): Promise<void>;
    function exitFullScreen(): Promise<void>;
    function isFullScreen(): Promise<boolean>;
    function show(): Promise<void>;
    function hide(): Promise<void>;
    function isVisible(): Promise<boolean>;
    function focus(): Promise<void>;
    function setIcon(icon: string): Promise<void>;
    function move(x: number, y: number): Promise<void>;
    function center(): Promise<void>;
    function setDraggableRegion(domElementOrId: string | HTMLElement): Promise<void>;
    function unsetDraggableRegion(domElementOrId: string | HTMLElement): Promise<void>;
    function setSize(options: WindowSizeOptions): Promise<void>;
    function getSize(): Promise<WindowSizeOptions>;
    function getPosition(): Promise<WindowPosOptions>;
    function setAlwaysOnTop(onTop: boolean): Promise<void>;
    function create(url: string, options?: WindowOptions): Promise<void>;
}
namespace events {
    interface Response {
        success: boolean;
        message: string;
    }
    type Builtin = "ready" | "trayMenuItemClicked" | "windowClose" | "serverOffline" | "clientConnect" | "clientDisconnect" | "appClientConnect" | "appClientDisconnect" | "extClientConnect" | "extClientDisconnect" | "extensionReady" | "neuDev_reloadApp";
    function on(event: string, handler: (ev: CustomEvent) => void): Promise<Response>;
    function off(event: string, handler: (ev: CustomEvent) => void): Promise<Response>;
    function dispatch(event: string, data?: any): Promise<Response>;
    function broadcast(event: string, data?: any): Promise<void>;
}
namespace extensions {
    interface ExtensionStats {
        loaded: string[];
        connected: string[];
    }
    function dispatch(extensionId: string, event: string, data?: any): Promise<void>;
    function broadcast(event: string, data?: any): Promise<void>;
    function getStats(): Promise<ExtensionStats>;
}
namespace updater {
    interface Manifest {
        applicationId: string;
        version: string;
        resourcesURL: string;
    }
    function checkForUpdates(url: string): Promise<Manifest>;
    function install(): Promise<void>;
}
namespace clipboard {
    function readText(key: string, data: string): Promise<void>;
    function writeText(data: string): Promise<string>;
}
namespace custom {
    function getMethods(): Promise<string[]>;
}
interface InitOptions {
    exportCustomMethods?: boolean;
}
function init(options?: InitOptions): void;
type ErrorCode = "NE_FS_DIRCRER" | "NE_FS_RMDIRER" | "NE_FS_FILRDER" | "NE_FS_FILWRER" | "NE_FS_FILRMER" | "NE_FS_NOPATHE" | "NE_FS_COPYFER" | "NE_FS_MOVEFER" | "NE_OS_INVMSGA" | "NE_OS_INVKNPT" | "NE_ST_INVSTKY" | "NE_ST_STKEYWE" | "NE_RT_INVTOKN" | "NE_RT_NATPRME" | "NE_RT_APIPRME" | "NE_RT_NATRTER" | "NE_RT_NATNTIM" | "NE_CL_NSEROFF" | "NE_EX_EXTNOTC" | "NE_UP_CUPDMER" | "NE_UP_CUPDERR" | "NE_UP_UPDNOUF" | "NE_UP_UPDINER";
interface Error {
    code: ErrorCode;
    message: string;
}

}

/** Basic authentication token */
declare const NL_TOKEN: string;

/** Operating system name: Linux, Windows, or Darwin */
declare const NL_OS: "Linux"|"Windows"|"Darwin";

/** Application identifier */
declare const NL_APPID: string;

/** Application port */
declare const NL_PORT: number;

/** Mode of the application: window, browser, or cloud */
declare const NL_MODE: "window"|"browser"|"cloud";

/** Neutralinojs server version */
declare const NL_VERSION: string;

/** Neutralinojs client version */
declare const NL_CVERSION: "3.12.0";

/** Current working directory */
declare const NL_CWD: string;

/** Application path */
declare const NL_PATH: string;

/** Command-line arguments */
declare const NL_ARGS: string[];

/** Current process's identifier */
declare const NL_PID: number

/** Release commit of the client library */
declare const NL_CCOMMIT: string;

/** An array of custom methods */
declare const NL_CMETHODS: string[];

