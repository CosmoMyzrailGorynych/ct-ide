// Used as private values in discardio mixin;
const discardioSources = new WeakMap<IRiotTag, IAsset>();
import {isDeepStrictEqual} from 'util';

/**
 * Implements functions for asset save/discard feature. It manages the `this.asset` property
 * and creates a hidden object of the source asset from `this.opts.asset`
 * for revert functionality.
 * by publishing public methods `writeChanges` and `discardChanges` onto the tag.
 *
 * @note You usually don't need call `discardChanges` unless you want to revert user edits
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
        riotTag.lastmod = Number(new Date());
        discardioSources.set(riotTag, Object.assign(discardioSources.get(riotTag), riotTag.asset));
        riotTag.asset = structuredClone(discardioSources.get(riotTag));
        window.signals.trigger('assetChanged', riotTag.asset);
        window.signals.trigger(`${riotTag.asset.type}Changed`, riotTag.asset);
    };
    riotTag.discardChanges = (): void => {
        riotTag.asset = structuredClone(discardioSources.get(riotTag));
    };
    riotTag.isDirty = (): boolean => !isDeepStrictEqual(
        riotTag.asset,
        discardioSources.get(riotTag)
    );
};
export default {
    init(this: IRiotTag): void {
        discardio(this);
    }
};
