// Used as private values in discardio mixin;
const discardioSources = new WeakMap<IRiotTag, IAsset>();
import {isDeepStrictEqual} from 'util';

/**
 * Implements functions for asset save/discard feature. It manages the `this.asset` property
 * and creates a hidden object of the source asset from `this.opts.asset`
 * for revert functionality.
 * Publishes public methods `writeChanges` and `discardChanges` onto the tag.
 *
 * @note You usually don't need to call `discardChanges` unless you want to revert user edits
 * and continue working in the same tag, in the same editor.
 * The actual asset is changed only when you call `writeChanges`.
 *
 * @example
 * ```js
 * this.mixin(window.riotDiscardio);
 * ```
 * ```pug
 * button(onclick="{writeChanges}") {vocGlob.apply}
 * button(onclick="{discardChanges}") {vocGlob.reset}
 * ```
 */
const discardio = (riotTag: IRiotTag) => {
    discardioSources.set(riotTag, riotTag.opts.asset);
    riotTag.asset = structuredClone(riotTag.opts.asset);
    riotTag.writeChanges = (): void => {
        riotTag.asset!.lastmod = Number(new Date());
        const sourceObject = discardioSources.get(riotTag)!;
        const changedObject = riotTag.asset!;
        // update the innards of the object without creating a new one
        for (const key of Object.keys(sourceObject)) {
            delete sourceObject[key as keyof typeof sourceObject];
        }
        Object.assign(sourceObject, changedObject);
        window.signals.trigger('assetChanged', riotTag.asset!.uid);
        window.signals.trigger(`${riotTag.asset!.type}Changed`, riotTag.asset!.uid);
    };
    riotTag.discardChanges = (): void => {
        riotTag.asset = structuredClone(discardioSources.get(riotTag));
    };
    riotTag.isDirty = (): boolean => !isDeepStrictEqual(
        riotTag.asset,
        discardioSources.get(riotTag)
    );
    const renamer = (payload: [string, string]) => {
        const [uid, name] = payload;
        if (riotTag.asset!.uid === uid) {
            (riotTag.asset as IAsset & {name: string}).name = name;
        }
    };
    riotTag.on('mount', () => {
        window.orders.on('renameAsset', renamer);
    });
    riotTag.on('unmount', () => {
        window.orders.off('renameAsset', renamer);
    });
};
export default {
    init(this: IRiotTag): void {
        discardio(this);
    }
} as IRiotMixin;
