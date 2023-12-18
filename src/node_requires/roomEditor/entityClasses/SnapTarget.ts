import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';
import {snapToRectangularGrid, snapToDiagonalGrid} from '../common';
import {getPixiTexture, getTexturePivot} from '../../resources/textures';
import {createTilePatch} from '../interactions/tiles/placeTile';
import {styleToTextStyle} from '../../styleUtils';

import * as PIXI from 'node_modules/pixi.js';
import {getById} from '../../resources';
import {getByPath} from '../../i18n';

let unknownTextures = getPixiTexture(-1, void 0, true);

const spriteLikeClasses: TemplateBaseClass[] = [
    'AnimatedSprite',
    'NineSlicePlane'
];

export class SnapTarget extends PIXI.Container {
    editor: RoomEditor;
    circle = new PIXI.Graphics();
    ghost: PIXI.AnimatedSprite;
    ghostText: PIXI.Text;
    ghostCompound = new PIXI.Container();
    prevGhostTex: ITexture;
    prevTilePatch: string;
    constructor(editor: RoomEditor) {
        super();
        unknownTextures = getPixiTexture(-1, void 0, true);
        this.editor = editor;
        this.ghost = new PIXI.AnimatedSprite(unknownTextures);
        this.ghostText = new PIXI.Text('');
        this.ghost.visible = this.ghostText.visible = false;
        this.ghost.alpha = this.ghostText.alpha = 0.5;
        [this.ghost.anchor.x, this.ghost.anchor.y] = [0.5, 0.5];
        this.addChild(this.ghost, this.ghostText, this.ghostCompound);
        this.circle.beginFill(getPixiSwatch('act'));
        this.circle.drawCircle(0, 0, 4);
        this.addChild(this.circle);
    }
    getPatchString(): string {
        const {tilePatch} = this.editor.riotEditor;
        return `${tilePatch.texture.uid}:${tilePatch.startX}:${tilePatch.startY}:${tilePatch.spanX}:${tilePatch.spanY}`;
    }
    update(): void {
        this.circle.scale.x = this.editor.camera.scale.x;
        this.circle.scale.y = this.editor.camera.scale.y;

        const {riotEditor} = this.editor;
        const {currentTemplate} = riotEditor;
        if (riotEditor.currentTool === 'addCopies' && currentTemplate !== -1) {
            const spritelike = spriteLikeClasses.includes(currentTemplate.baseClass),
                  textlike = currentTemplate.baseClass === 'Text';
            this.ghost.visible = spritelike;
            this.ghostText.visible = textlike;
            if (spritelike) {
                if (currentTemplate.texture === -1 &&
                    this.ghost.textures !== unknownTextures
                ) {
                    this.updateGhost(-1);
                    this.ghost.textures = unknownTextures;
                }
                if (currentTemplate.texture !== -1 &&
                    this.prevGhostTex !== getById('texture', currentTemplate.texture)
                ) {
                    this.updateGhost(currentTemplate.texture);
                    this.prevGhostTex = getById('texture', currentTemplate.texture);
                }
            } else if (textlike) {
                this.updateTextGhost(currentTemplate);
            } else {
                this.updateGhost(-1);
                this.ghost.textures = unknownTextures;
                this.ghost.visible = true;
            }
        } else {
            this.ghost.visible = false;
            this.ghostText.visible = false;
        }
        if (riotEditor.currentTool === 'addTiles' && riotEditor.tilePatch?.texture) {
            if (this.prevTilePatch !== this.getPatchString()) {
                this.ghostCompound.removeChildren();
                this.ghostCompound.visible = true;
                this.ghostCompound.addChild(...createTilePatch(riotEditor.tilePatch, {
                    x: 0,
                    y: 0
                }, this.editor, true));
                this.prevTilePatch = this.getPatchString();
            }
        } else {
            this.ghostCompound.visible = false;
            if (this.ghostCompound.children.length) {
                this.ghostCompound.removeChildren();
            }
        }
        const {cursor} = this.editor;
        cursor.getLocalPosition(this.editor.overlays, this.position);

        if (!riotEditor.gridOn || riotEditor.freePlacementMode) {
            return;
        }
        let snappedPos;
        if (this.editor.ctRoom.diagonalGrid) {
            snappedPos = snapToDiagonalGrid({
                x: this.x,
                y: this.y
            }, this.editor.ctRoom.gridX, this.editor.ctRoom.gridY);
        } else {
            snappedPos = snapToRectangularGrid({
                x: this.x,
                y: this.y
            }, this.editor.ctRoom.gridX, this.editor.ctRoom.gridY);
        }
        this.x = snappedPos.x;
        this.y = snappedPos.y;
    }
    updateGhost(texture: assetRef | ITexture): void {
        this.ghost.textures = getPixiTexture(texture, void 0, true);
        [this.ghost.anchor.x, this.ghost.anchor.y] = getTexturePivot(texture);
    }
    updateTextGhost(template: ITemplate): void {
        this.ghostText.text = template.defaultText ||
            (getByPath('roomView.emptyTextFiller') as string);
        if (template.textStyle && template.textStyle !== -1) {
            const style = getById('style', template.textStyle);
            this.ghostText.style = styleToTextStyle(style) as unknown as Partial<PIXI.ITextStyle>;
        } else {
            this.ghostText.style = PIXI.TextStyle.defaultStyle;
        }
    }
}
