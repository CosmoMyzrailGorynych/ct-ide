import {TileLayer} from './entityClasses/TileLayer';

import {ITilePatch} from './interactions/tiles/ITilePatch';
import {RoomEditor} from '.';

type tool = 'select' | 'addCopies' | 'addTiles' | 'manageBackgrounds' | 'roomProperties';

export interface IRoomEditorRiotTag {
    update(): void;
    tilePatch: ITilePatch;
    currentTileLayer: TileLayer;
    room: IRoom;
    refs: {
        propertiesPanel?: {
            updatePropList(): void;
            applyChanges(): void;
            update(): void;
        },
        tileEditor?: {
            update(): void;
        },
        backgroundsEditor?: {
            update(): void;
        },
        zoomLabel: HTMLSpanElement
    };
    root: HTMLElement;
    pixiEditor: RoomEditor;
    zoom: number;
    gridOn: boolean;
    freePlacementMode: boolean;
    controlMode: boolean;
    currentTool: tool;
    currentTemplate: ITemplate | -1;
    setTool(tool: tool): () => void;
    changeSelectedTemplate(templateId: string): void;
}
