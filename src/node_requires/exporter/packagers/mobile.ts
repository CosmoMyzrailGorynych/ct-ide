// TODO: Move into Bun sidekick

import {join} from 'path';
import fs from '../../neutralino-fs-extra';


import {execa} from 'execa';

import {getBuildDir} from '../../platformUtils';
import {getDOMImageFromTexture} from '../../resources/textures';
import {imageCover, imageContain, imagePlaceInRect, imageRound, outputCanvasToFile} from '../../utils/imageUtils';

// @see https://cordova.apache.org/docs/en/latest/config_ref/images.html
const androidIcons: Record<string, number> = {
    // ldpi: 36,
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192
};
// Pairs of total canvas side length and suggested icon size
const androidUniversalIcons: Record<string, [number, number]> = {
    // ldpi: [54, 36],
    mdpi: [108, 72],
    hdpi: [162, 110],
    xhdpi: [216, 144],
    xxhdpi: [324, 220],
    xxxhdpi: [432, 294]
};
// Sizes for portrait mode; landscape modes are simply rotated
const androidSplashScreens: Record<string, [number, number]> = {
    mdpi: [320, 480],
    hdpi: [480, 800],
    xhdpi: [720, 1280],
    xxhdpi: [960, 1600],
    xxxhdpi: [1280, 1920]
};

// eslint-disable-next-line max-lines-per-function
export const exportMobile = async (
    project: IProject,
    exportedPath: string,
    onProgress?: (log: string) => void
): Promise<string> => {
    onProgress = onProgress ?? (() => void 0);
    const {settings} = project;

    const appId = settings.authoring.appId || 'rocks.ctjs.defaultpackageid';
    const version = settings.authoring.version.join('.') + settings.authoring.versionPostfix;

    const buildDir = await getBuildDir();
    const capacitorProjectPath = join(
        buildDir,
        `${settings.authoring.title || 'mobileBuild'}-android`
    );
    const execaConfig = {
        cwd: capacitorProjectPath
    };

    onProgress('Checking for an existing Capacitor project…');

    const existingProject = await fs.pathExists(join(capacitorProjectPath, 'capacitor.config.json'));
    if (existingProject) {
        onProgress('Discovered an existing Capacitor project.');
    } else {
        onProgress('No existing projects found. Will create one.');
    }

    onProgress('Preparing build directories…');
    const webAppPath = join(capacitorProjectPath, 'web/');
    await fs.remove(webAppPath);
    await fs.copy(exportedPath, webAppPath);

    if (!existingProject) {
        onProgress('Creating Capacitor project…');
        onProgress((await execa('npm', [
            'init',
            '-y'
        ], execaConfig)).stdout);
        onProgress((await execa('npm', [
            'install',
            '@capacitor/core',
            '@capacitor/cli',
            '@capacitor/android',
            '--save'
        ], execaConfig)).stdout);
        onProgress((await execa('node', [
            './@capacitor/cli/bin/capacitor',
            'init',
            settings.authoring.title || 'Ct.js game',
            appId,
            '--web-dir',
            webAppPath
        ], execaConfig)).stdout);
        onProgress('Adding Android platform…');
        onProgress((await execa('node', [
            './@capacitor/cli/bin/capacitor',
            'add',
            'android'
        ], execaConfig)).stdout);
    }

    onProgress('Configuring the Capacitor project…');
    const {MobileProject} = require('@trapezedev/project');
    const mobileProject = new MobileProject(capacitorProjectPath, {
        android: {
            path: 'android'
        }
    });
    await mobileProject.load();
    await mobileProject.android.setPackageName(appId);
    await mobileProject.android.setVersionName(version);
    await mobileProject.android.getAndroidManifest().setAttrs('manifest/application/activity', {
        'android:screenOrientation': settings.rendering.mobileScreenOrientation
    });
    await mobileProject.commit();

    onProgress('Baking icons and splash screens…');
    const iconsSplashesPromises = [];
    const projIconImage = await getDOMImageFromTexture(settings.branding.icon || -1, 'ct_ide.png');
    for (const name in androidIcons) {
        const icon = imageContain(
            projIconImage,
            androidIcons[name],
            androidIcons[name],
            settings.branding.forceSmoothIcons
        );
        // "Universal outer", "Universal inner"
        const [uo, ui] = androidUniversalIcons[name];
        const universalIcon = imagePlaceInRect(
            projIconImage,
            uo, uo, ui, ui,
            settings.branding.forceSmoothIcons
        );
        const roundIcon = imageRound(icon);
        iconsSplashesPromises.push(outputCanvasToFile(
            icon,
            join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher.png')
        ));
        iconsSplashesPromises.push(outputCanvasToFile(
            universalIcon,
            join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher_foreground.png')
        ));
        iconsSplashesPromises.push(outputCanvasToFile(
            roundIcon,
            join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher_round.png')
        ));
    }
    const projSplashImage = await getDOMImageFromTexture(settings.branding.splashScreen || -1, 'data/img/defaultSplashScreen.png');
    for (const name in androidSplashScreens) {
        const portrait = imageCover(
            projSplashImage,
            androidSplashScreens[name][0],
            androidSplashScreens[name][1],
            settings.branding.forceSmoothSplashScreen
        );
        const landscape = imageCover(
            projSplashImage,
            androidSplashScreens[name][1],
            androidSplashScreens[name][0],
            settings.branding.forceSmoothSplashScreen
        );
        iconsSplashesPromises.push(outputCanvasToFile(
            portrait,
            join(capacitorProjectPath, 'android/app/src/main/res', `drawable-port-${name}`, 'splash.png')
        ));
        iconsSplashesPromises.push(outputCanvasToFile(
            landscape,
            join(capacitorProjectPath, 'android/app/src/main/res', `drawable-land-${name}`, 'splash.png')
        ));
    }
    const miniSplash = imageCover(projSplashImage, 480, 320);
    iconsSplashesPromises.push(outputCanvasToFile(
        miniSplash,
        join(capacitorProjectPath, 'android/app/src/main/res/drawable/splash.png')
    ));
    await Promise.all(iconsSplashesPromises);

    onProgress('Fetching available emulator devices…');
    const [, , device] = (await execa('node', [
        './@capacitor/cli/bin/capacitor',
        'run',
        '--list',
        'android'
    ], execaConfig)).stdout.split('\n')[2].split(/ {2,}/);
    if (!device) {
        throw new Error('No available devices found! You will need to add one to your Android Studio > Android Virtual Device Manager.');
    }
    onProgress(`Will use ${device}.`);

    onProgress('Baking APK…');
    onProgress((await execa('node', [
        './@capacitor/cli/bin/capacitor',
        'run',
        '--target',
        device,
        'android'
    ], execaConfig)).stdout);

    onProgress('Success! Emulator launched. APK files are available at:');
    const apkFolder = join(capacitorProjectPath, 'android/app/build/outputs/apk');
    onProgress(apkFolder);
    return apkFolder;
};
