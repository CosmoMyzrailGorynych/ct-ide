import type {packForDesktopOptions, packForDesktopResponse} from './messagingContract.js';

/* eslint-disable max-lines-per-function */
import {join} from 'path';
import {tmpdir} from 'os';
import {readFile, outputJSON, outputFile, copy, mkdtemp, remove, ensureDir} from 'fs-extra';

const {bundleApp} = require('@neutralinojs/neu/src/modules/bundler.js');
import {createICNS, BILINEAR, HERMITE, createICO} from '@ctjs/png2icons';
import * as resedit from 'resedit';
// pe-library is a direct dependency of resedit
import * as peLibrary from 'pe-library';

import {sendEvent} from '../../index.js';

import neutralinoConfig from './neutralino.config.json';
import neutralinoClient from './game/neutralino.js' with {type: 'file'};
import neutralinoLinuxArm64 from './bin/neutralino-linux_arm64' with {type: 'file'};
import neutralinoLinuxArmhf from './bin/neutralino-linux_armhf' with {type: 'file'};
import neutralinoLinuxX64 from './bin/neutralino-linux_x64' with {type: 'file'};
import neutralinoMacArm64 from './bin/neutralino-mac_arm64' with {type: 'file'};
import neutralinoMacUniversal from './bin/neutralino-mac_universal' with {type: 'file'};
import neutralinoMacX64 from './bin/neutralino-mac_x64' with {type: 'file'};
import neutralinoWinX64 from './bin/neutralino-win_x64.exe' with {type: 'file'};
import windowsNetFix from './windowsNetFix.ps1' with {type: 'file'};

const fileMap = {
    'bin/neutralino-linux_arm64': neutralinoLinuxArm64,
    'bin/neutralino-linux_armhf': neutralinoLinuxArmhf,
    'bin/neutralino-linux_x64': neutralinoLinuxX64,
    'bin/neutralino-mac_arm64': neutralinoMacArm64,
    'bin/neutralino-mac_universal': neutralinoMacUniversal,
    'bin/neutralino-mac_x64': neutralinoMacX64,
    'bin/neutralino-win_x64.exe': neutralinoWinX64,
    'game/neutralino.js': neutralinoClient,
    'Run as admin to fix white screen.ps1': windowsNetFix
};

const forbidden = /['"\\[\]():*?.]/g;

const makeIcons = async (iconPath: string, pixelart: boolean, outputFolder: string) => {
    const icon = await readFile(iconPath);
    await Promise.all([
        outputFile(join(outputFolder, 'icon.icns'), createICNS(
            icon,
            pixelart ? BILINEAR : HERMITE,
            0
        )),
        outputFile(join(outputFolder, 'icon.ico'), createICO(
            icon,
            pixelart ? HERMITE : BILINEAR,
            0, true, true
        )),
        outputFile(join(outputFolder, 'icon.png'), icon)
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
 * @returns The path to a folder with the packaged game.
 */
export default async (payload: packForDesktopOptions): Promise<packForDesktopResponse> => {
    const tempDir = await mkdtemp(join(tmpdir(), 'ct-desktop-export-'));
    const config = structuredClone(neutralinoConfig);
    config.cli.binaryName = payload.authoring.title.replace(forbidden, '');
    config.modes.window.title = payload.authoring.title;
    config.modes.window.width = payload.startingWidth;
    config.modes.window.height = payload.startingHeight;
    switch (payload.desktopMode) {
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
    if (payload.authoring.appId) {
        config.applicationId = payload.authoring.appId;
    }
    config.version = payload.authoring.version.join('.');
    if (payload.versionPostfix) {
        config.version += payload.versionPostfix;
    }

    sendEvent('desktopBuildProgress', 'Preparing Neutralino.js binaries and icons…');
    await Promise.all([
        ensureDir(join(tempDir, 'game')),
        ensureDir(join(tempDir, 'bin'))
    ]);
    await Promise.all([
        outputJSON(join(tempDir, 'neutralino.config.json'), config, {
            spaces: 2
        }),
        // copy in parallel alongside other processes
        ...Object.entries(fileMap).map(async ([key, fileRef]) => {
            const file = Bun.file(fileRef);
            const output = Bun.file(join(tempDir, key));
            await Bun.write(output, file);
        }),
        copy(payload.inputDir, join(tempDir, 'game')),
        makeIcons(payload.iconPath, payload.pixelartIcon, tempDir)
    ]);

    sendEvent('desktopBuildProgress', 'Packing your project…');
    const initialCwd = process.cwd();
    process.chdir(tempDir);
    await bundleApp(true);
    process.chdir(initialCwd);

    sendEvent('desktopBuildProgress', 'Patching Windows executable with icons and your metadata…');
    const winPath = join(
        tempDir,
        'dist',
        config.cli.binaryName,
        `${config.cli.binaryName}-${platformMap['win-x64']}`
    );
    const iconPath = join(tempDir, 'icon.ico');

    const exe = peLibrary.NtExecutable.from(await readFile(winPath));
    const res = peLibrary.NtExecutableResource.from(exe);
    const iconBuffer = await readFile(iconPath);
    const iconFile = resedit.Data.IconFile.from(iconBuffer);
    // English (United States)
    const EN_US = 1033;
    resedit.Resource.IconGroupEntry.replaceIconsForResource(
        res.entries,
        0,
        EN_US,
        iconFile.icons.map(i => i.data)
    );
    const vi = resedit.Resource.VersionInfo.createEmpty();
    const [major, minor, patch] = payload.authoring.version;
    vi.setFileVersion(major, minor, patch, 0, EN_US);
    vi.setStringValues({
        lang: EN_US,
        codepage: 1200
    }, {
        CompanyName: payload.authoring.author || 'A ct.js game developer',
        FileDescription: payload.authoring.title || 'A ct.js game',
        FileVersion: payload.authoring.version.join('.') + '.0',
        InternalName: payload.authoring.title || 'A ct.js game',
        LegalCopyright: `Copyright © ${new Date().getFullYear()} ${payload.authoring.author || 'A ct.js game developer'}`,
        OriginalFilename: `${payload.authoring.title || 'Ct.js game'}.exe`,
        ProductName: payload.authoring.title || 'A ct.js game',
        ProductVersion: payload.authoring.version.join('.') + '.0'
    });
    vi.outputToResourceEntries(res.entries);
    res.outputResource(exe);
    const outBuffer = Buffer.from(exe.generate());
    await outputFile(winPath, outBuffer);

    sendEvent('desktopBuildProgress', 'Sorting the artifacts by platform…');
    const outputPath = join(payload.outputDir, config.cli.binaryName);
    await ensureDir(outputPath);
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

    await Promise.all(sortPromises);

    if (Math.random() < 0.01) {
        sendEvent('desktopBuildProgress', 'Hiding a stash of catnip…');
    }

    sendEvent('desktopBuildProgress', 'Scheduling a cleanup…');
    remove(tempDir); // Executes outside of the function body's timeline.


    sendEvent('desktopBuildProgress', `Done! Output at ${outputPath}`);
    return outputPath;
};
