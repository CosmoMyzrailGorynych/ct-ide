import {run} from 'buntralino-client';
import {getTextureOrig} from 'src/lib/resources/textures';
import {showFolder, getDirectories} from 'src/lib/platformUtils';
import {getStartingRoom} from '../rooms';
import res from '../../neutralino-res-extra';
import fs from '../../neutralino-fs-extra';

export const exportForDesktop = async (project: IProject, inputDir: string) => {
    const startingRoom = getStartingRoom(project);
    let iconPath: string;
    const tempDir = await fs.mkdtemp(await Neutralino.os.getPath('temp') + '/ctjs-exporter-');
    try {
        if (project.settings.branding.icon === -1) {
            iconPath = tempDir + '/defaultIcon.png';
            await res.extractFile('/app/' + getTextureOrig(project.settings.branding.icon, true), iconPath);
        } else {
            iconPath = getTextureOrig(project.settings.branding.icon, true);
        }
        const outputDir = await run('packForDesktop', {
            authoring: project.settings.authoring,
            desktopMode: project.settings.rendering.desktopMode,
            iconPath,
            inputDir,
            outputDir: (await getDirectories()).builds,
            startingHeight: startingRoom.height,
            startingWidth: startingRoom.width,
            versionPostfix: project.settings.authoring.versionPostfix || '',
            pixelartIcon: project.settings.rendering.pixelatedrender &&
                !project.settings.branding.forceSmoothIcons
        }) as string;
        showFolder(outputDir);
    } finally {
        fs.remove(tempDir);
    }
};
