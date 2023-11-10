import * as PIXI from 'node_modules/pixi.js';

import {Copy} from './entityClasses/Copy';
import {Tile} from './entityClasses/Tile';
import {TileLayer} from './entityClasses/TileLayer';
import {Background} from './entityClasses/Background';
import {RoomEditor} from '.';

type stateSnapshot = {
    position: {
        x: number;
        y: number;
    }
    rotation: number;
    scale: {
        x: number;
        y: number;
    }
    tint: number;
    alpha: number;
    customTextSettings?: Copy['customTextSettings'];
};

/**
 * In order: The entity that was changed, transformation before the change, and after it.
 */
type transformation = {
    type: 'transformation',
    transformations: Map<Copy | Tile, [stateSnapshot, stateSnapshot]>
};

type deletion = {
    type: 'deletion',
    deleted: Set<[Copy | Tile, TileLayer?]>
};
type creation = {
    type: 'creation',
    created: Set<[Copy | Tile, TileLayer?]>
};

type tileLayerCreation = {
    type: 'tileLayerCreation',
    created: TileLayer
}
type tileLayerDeletion = {
    type: 'tileLayerDeletion',
    deleted: TileLayer
}

type backgroundCreation = {
    type: 'backgroundCreation',
    created: Background
}
type backgroundDeletion = {
    type: 'backgroundDeletion',
    deleted: Background
}

type propChange = {
    type: 'propChange',
    key: string,
    target: unknown,
    before: unknown,
    after: unknown
}

type ui = {
    type: 'ui',
    target: Copy,
    before: {
        customTextSettings?: Copy['customTextSettings']
    },
    after: {
        customTextSettings?: Copy['customTextSettings']
    }
}

export type change = transformation | deletion | creation |
                     tileLayerCreation | tileLayerDeletion |
                     backgroundCreation | backgroundDeletion |
                     propChange | ui;

const snapshotTransform = (entity: Copy | Tile): stateSnapshot => {
    const snapshot: stateSnapshot = {
        position: {
            x: entity.position.x,
            y: entity.position.y
        },
        rotation: entity.rotation,
        scale: {
            x: entity.scale.x,
            y: entity.scale.y
        },
        tint: ((entity as Copy).sprite ?? (entity as Copy).text ?? (entity as Tile)).tint as number,
        alpha: entity.alpha
    };
    return snapshot;
};

export class History {
    stack: change[] = [];
    /**
     * Describes the last change made in the given period of time in history.
     * Undo operation undos this change, while redo operation redos the change next to it.
     */
    currentChange?: change;
    editor: RoomEditor;

    constructor(editor: RoomEditor) {
        this.editor = editor;
    }

    // eslint-disable-next-line complexity
    undo(): boolean {
        if (!this.currentChange) {
            return false;
        }
        const change = this.currentChange;
        // eslint-disable-next-line default-case
        switch (change.type) {
        case 'transformation':
            this.editor.transformer.clear();
            for (const transform of change.transformations) {
                const [entity, [before]] = transform;
                entity.position.set(before.position.x, before.position.y);
                entity.scale.set(before.scale.x, before.scale.y);
                (entity as Copy).updateNinePatch?.();
                entity.alpha = before.alpha;
                entity.rotation = before.rotation;
                // Why do I ever need to type-annotate this?
                ((entity as Copy).sprite ?? (entity as Copy).text ?? (entity as Tile)).tint =
                    before.tint;
                if (entity instanceof Copy && entity.text) {
                    entity.customTextSettings = before.customTextSettings;
                }
                this.editor.currentSelection.add(entity);
            }
            this.editor.transformer.setup(true);
            this.editor.riotEditor.refs.propertiesPanel?.updatePropList();
            break;
        case 'deletion':
            for (const deletion of change.deleted) {
                const [entity, parent] = deletion;
                entity.restore(parent);
            }
            break;
        case 'creation':
            this.editor.transformer.clear();
            for (const creation of change.created) {
                const [entity] = creation;
                entity.detach();
            }
            break;
        case 'tileLayerCreation':
            change.created.detach();
            if (!this.editor.tileLayers.includes(this.editor.riotEditor.currentTileLayer)) {
                [this.editor.riotEditor.currentTileLayer] = this.editor.tileLayers;
            }
            this.editor.riotEditor.refs.tileEditor?.update();
            break;
        case 'tileLayerDeletion':
            change.deleted.restore();
            this.editor.riotEditor.currentTileLayer = change.deleted;
            this.editor.riotEditor.refs.tileEditor?.update();
            break;
        case 'backgroundCreation':
            change.created.detach();
            this.editor.riotEditor.refs.backgroundsEditor?.update();
            break;
        case 'backgroundDeletion':
            change.deleted.restore();
            this.editor.riotEditor.refs.backgroundsEditor?.update();
            break;
        case 'propChange':
            (change.target as Record<string, unknown>)[change.key] = change.before;
            this.updateUiFor(change);
            break;
        case 'ui': {
            const {target, before} = change;
            target.customTextSettings = before.customTextSettings;
            target.updateText();
            this.editor.riotEditor.refs.uiTools?.update();
        } break;
        }
        const prevChangeType = change.type;
        this.currentChange = this.stack[this.stack.indexOf(change) - 1];
        if (prevChangeType === 'transformation' && !this.currentChange) {
            // If we reached history's end with transformation reversal, leave
            // this last change as current one, as the transformer selects the same set
            // of entities and initial transforms are totally correct.
            [this.currentChange] = this.stack;
        }
        this.editor.riotEditor.update();
        return true;
    }
    redo(): boolean {
        if (this.currentChange === this.stack[this.stack.length - 1]) {
            return false;
        }
        const newChange = this.stack[this.stack.indexOf(this.currentChange) + 1];
        // eslint-disable-next-line default-case
        switch (newChange.type) {
        case 'transformation':
            this.editor.transformer.clear();
            for (const change of newChange.transformations) {
                const [entity, [, after]] = change;
                entity.position.set(after.position.x, after.position.y);
                entity.scale.set(after.scale.x, after.scale.y);
                entity.alpha = after.alpha;
                entity.rotation = after.rotation;
                (entity as Copy).updateNinePatch?.();
                ((entity as Copy).sprite ?? (entity as Copy).text ?? (entity as Tile)).tint =
                    after.tint;
                if (entity instanceof Copy && entity.text) {
                    entity.customTextSettings = after.customTextSettings;
                }
                this.editor.currentSelection.add(entity);
            }
            this.editor.transformer.setup(true);
            this.editor.riotEditor.refs.propertiesPanel?.updatePropList();
            break;
        case 'deletion':
            this.editor.transformer.clear();
            for (const deletion of newChange.deleted) {
                const [entity] = deletion;
                entity.detach();
            }
            break;
        case 'creation':
            for (const creation of newChange.created) {
                const [entity, parent] = creation;
                entity.restore(parent);
            }
            break;
        case 'tileLayerCreation':
            newChange.created.restore();
            this.editor.riotEditor.currentTileLayer = newChange.created;
            this.editor.riotEditor.refs.tileEditor?.update();
            break;
        case 'tileLayerDeletion':
            newChange.deleted.detach();
            if (!this.editor.tileLayers.includes(newChange.deleted)) {
                [this.editor.riotEditor.currentTileLayer] = this.editor.tileLayers;
            }
            this.editor.riotEditor.refs.tileEditor?.update();
            break;
        case 'backgroundCreation':
            newChange.created.restore();
            this.editor.riotEditor.refs.backgroundsEditor?.update();
            break;
        case 'backgroundDeletion':
            newChange.deleted.detach();
            this.editor.riotEditor.refs.backgroundsEditor?.update();
            break;
        case 'propChange':
            (newChange.target as Record<string, unknown>)[newChange.key] = newChange.after;
            this.updateUiFor(newChange);
            break;
        case 'ui': {
            const {target, after} = newChange;
            target.customTextSettings = after.customTextSettings;
            target.updateText();
            this.editor.riotEditor.refs.uiTools?.update();
        } break;
        }
        this.currentChange = newChange;
        this.editor.riotEditor.update();
        return true;
    }
    pushChange(change: change): void {
        const id = this.stack.indexOf(this.currentChange);
        this.stack = this.stack.slice(0, id + 1);
        this.stack.push(change);
        this.currentChange = change;
        if (this.stack.length > 30) {
            this.stack.shift();
        }
        this.editor.riotEditor.update();
    }
    initiateTransformChange(): void {
        const transform: change = {
            type: 'transformation',
            transformations: new Map()
        };
        for (const entity of this.editor.currentSelection) {
            const initialTransform = snapshotTransform(entity);
            transform.transformations.set(entity as Copy | Tile, [
                initialTransform,
                {
                    ...initialTransform
                }
            ]);
        }
        this.pushChange(transform);
    }
    snapshotTransforms(): void {
        if (this.currentChange.type !== 'transformation') {
            throw new Error('Cannot snapshot transforms as the current change\'s type is not "transformation"');
        }
        for (const [entity, value] of this.currentChange.transformations) {
            value[1] = snapshotTransform(entity);
        }
        void this;
    }
    collectUiState(): ui['before'] {
        const target = this.editor.currentUiSelection;
        const change = {} as ui['before'];
        if (target && target.text) {
            change.customTextSettings = {
                ...target.customTextSettings,
                anchor: {
                    ...target.customTextSettings.anchor
                }
            };
        }
        return change;
    }
    initiateUiChange(): void {
        if (!this.editor.currentUiSelection) {
            throw new Error('Cannot initiate a ui change as the current selection is not set');
        }
        const transform: change = {
            type: 'ui',
            target: this.editor.currentUiSelection,
            before: this.collectUiState(),
            after: this.collectUiState()
        };
        this.pushChange(transform);
    }
    snapshotUi(): void {
        if (!this.editor.currentUiSelection) {
            throw new Error('Cannot snapshot a ui change as the current selection is not set');
        }
        if (this.currentChange.type !== 'ui') {
            throw new Error('Cannot snapshot transforms as the current change\'s type is not "ui"');
        }
        this.currentChange.after = {
            customTextSettings: {
                ...this.editor.currentUiSelection.customTextSettings,
                anchor: {
                    ...this.editor.currentUiSelection.customTextSettings.anchor
                }
            }
        };
    }
    updateUiFor(change: propChange): void {
        const {target, key} = change,
              {editor} = this,
              riot = editor.riotEditor;
        if (target instanceof TileLayer) {
            riot.refs.tileEditor?.update();
        } else if (target === editor.ctRoom) {
            riot.refs.propertiesPanel?.update();
            if (key === 'backgroundColor') {
                (editor.renderer as PIXI.Renderer).background.color =
                    (new PIXI.Color(editor.ctRoom.backgroundColor)).toHex();
            }
        } else if (target instanceof Background) {
            if (key === 'bgTexture') {
                target.changeTexture(target.bgTexture);
            }
            riot.refs.backgroundsEditor?.update();
        } else if (target instanceof Copy) {
            riot.refs.uiTools?.update();
            riot.refs.propertiesPanel?.update();
            target.recreate();
        }
    }

    get canUndo(): boolean {
        return Boolean(this.currentChange);
    }
    get canRedo(): boolean {
        return this.currentChange !== this.stack[this.stack.length - 1];
    }
}
