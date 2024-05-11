import {join} from 'path';
import {tmpdir} from 'os';
import {readJson, readFile, outputJSON, outputFile, copy, mkdtemp, remove, ensureDir} from 'fs-extra';
import {getBuildDir, isNodeInstalled} from '../platformUtils';
import {getStartingRoom} from './rooms';
import {getTextureOrig} from '../resources/textures';

const {bundleApp} = require('@neutralinojs/neu/src/modules/bundler.js');

const png2icons = require('png2icons');

const forbidden = /['"\\[\]():*?.]/g;

const makeIcons = async (project: IProject, folder: string) => {
    const iconPath = getTextureOrig(project.settings.branding.icon || -1, true),
          icon = await readFile(iconPath);
    await Promise.all([
        outputFile(join(folder, 'icon.icns'), png2icons.createICNS(
            icon,
            project.settings.rendering.pixelatedrender ? png2icons.BILINEAR : png2icons.HERMITE
        )),
        outputFile(join(folder, 'icon.ico'), png2icons.createICO(
            icon,
            project.settings.rendering.pixelatedrender ? png2icons.HERMITE : png2icons.BILINEAR,
            0, true, true
        )),
        outputFile(join(folder, 'icon.png'), icon)
    ]);
};

/* eslint-disable camelcase */
const platformMap = {
    'linux-arm64': 'linux_arm64',
    'linux-armhf': 'linux_armhf',
    'linux-x64': 'linux_x64',
    'mac-arm64': 'mac_arm64',
    'mac-universal': 'mac_universal',
    'mac-x64': 'mac_x64',
    'win-x64': 'win_x64.exe'
};
/* eslint-enable camelcase */

/**
 * @returns The path to a folder with packaged game.
 */
// eslint-disable-next-line max-lines-per-function
export const exportForDesktop = async (
    project: IProject,
    exportedPath: string,
    onProgress?: (log: string) => void
): Promise<string> => {
    onProgress = onProgress ?? (() => void 0);
    onProgress('Forming configuration file for Neutralino.js…');
    const tempDir = await mkdtemp(join(tmpdir(), 'ct-desktop-export-'));
    const config = await readJson('./data/ct.release/desktopPack/neutralino.config.json');
    const startingRoom = getStartingRoom(project);
    config.cli.binaryName = project.settings.authoring.title.replace(forbidden, '');
    config.modes.window.title = project.settings.authoring.title;
    config.modes.window.width = startingRoom.width;
    config.modes.window.height = startingRoom.height;
    switch (project.settings.rendering.desktopMode) {
    case 'fullscreen':
        config.modes.window.fullScreen = true;
        config.modes.window.maximize = true;
        break;
    case 'windowed':
        config.modes.window.fullScreen = false;
        config.modes.window.maximize = false;
        break;
    case 'maximized':
    default:
        config.modes.window.fullScreen = false;
        config.modes.window.maximize = true;
        break;
    }
    if (project.settings.authoring.appId) {
        config.applicationId = project.settings.authoring.appId;
    }
    config.version = project.settings.authoring.version.join('.');
    if (project.settings.authoring.versionPostfix) {
        config.version += project.settings.authoring.versionPostfix;
    }

    onProgress('Preparing Neutralino.js binaries and icons…');
    await ensureDir(join(tempDir, 'game'));
    const preparePkgPromises = [
        outputJSON(join(tempDir, 'neutralino.config.json'), config, {
            spaces: 2
        }),
        copy(exportedPath, join(tempDir, 'game')),
        copy('./data/ct.release/desktopPack/game', join(tempDir, 'game')),
        copy('./data/ct.release/desktopPack/bin', join(tempDir, 'bin')),
        makeIcons(project, join(tempDir))
    ];
    await Promise.all(preparePkgPromises);

    onProgress('Packing your project…');
    const initialCwd = process.cwd();
    process.chdir(tempDir);
    await bundleApp(true);
    process.chdir(initialCwd);

    onProgress('Patching Windows executable with icons and your metadata…');
    const winPath = join(
        tempDir,
        'dist',
        config.cli.binaryName,
        `${config.cli.binaryName}-${platformMap['win-x64']}`
    );
    const iconPath = join(tempDir, 'icon.ico');

    /*
    // eslint-disable-next-line no-eval
    const resedit = (await eval('import(\'resedit-cli\')')).default;
    await resedit({
        in: winPath,
        out: winPath,
        'product-name': project.settings.authoring.title || 'A ct.js game',
        'product-version': project.settings.authoring.version.join('.') + '.0',
        'file-version': project.settings.authoring.version.join('.') + '.0',
        'company-name': project.settings.authoring.author || 'A ct.js game developer',
        'original-filename': `${project.settings.authoring.title || 'Ct.js game'}.exe`,
        icon: [iconPath]
    });
    */
    if (isNodeInstalled) {
        const {execa} = require('execa');
        try {
            const {stdout} = await execa('node', [
                './resedit-cli/dist/cli.js',
                '--in',
                winPath,
                '--out',
                winPath,
                '--product-name',
                project.settings.authoring.title || 'A ct.js game',
                '--product-version',
                project.settings.authoring.version.join('.') + '.0',
                '--file-version',
                project.settings.authoring.version.join('.') + '.0',
                '--company-name',
                project.settings.authoring.author || 'A ct.js game developer',
                '--original-filename',
                `${project.settings.authoring.title || 'Ct.js game'}.exe`,
                '--icon',
                iconPath
            ]);
            onProgress(stdout);
        } catch (err) {
            onProgress('Patching the windows executable failed!');
            onProgress(err);
        }
    }

    onProgress('Sorting the artifacts by platform…');
    const buildDir = await getBuildDir();
    const outputPath = join(buildDir, config.cli.binaryName);
    const sortPromises: Promise<void>[] = [];
    const neu = join(tempDir, 'dist', config.cli.binaryName, 'resources.neu');
    for (const platform in platformMap) {
        const filenameSuffix = platformMap[platform as keyof typeof platformMap];
        const sourceBinary = join(tempDir, 'dist', config.cli.binaryName, `${config.cli.binaryName}-${filenameSuffix}`),
              targetBinary = join(outputPath, `${config.cli.binaryName}-${platform}`, `${config.cli.binaryName}${platform === 'win-x64' ? '.exe' : ''}`),
              targetNeu = join(outputPath, `${config.cli.binaryName}-${platform}`, 'resources.neu');

        sortPromises.push(copy(sourceBinary, targetBinary));
        sortPromises.push(copy(neu, targetNeu));
    }
    sortPromises.push(copy(
        './data/ct.release/desktopPack/windowsNetFix.ps1',
        join(outputPath, `${config.cli.binaryName}-win-x64`, 'Run as admin to fix white screen.ps1')
    ));

    await Promise.all(sortPromises);

    if (Math.random() < 0.01) {
        onProgress('Hiding a stash of catnip…');
    }

    onProgress('Scheduling a cleanup…');
    remove(tempDir); // Executes outside of the function body's timeline.


    onProgress(`Done! Output at ${outputPath}`);
    return outputPath;
};
