* Skeletons are edited by texture-editor.tag
* You can register editors for new asset types at `node_requires/resources`
* Editors **must not** edit the asset directly. Instead, they should create a copy first and then save or discard it.
* Each editor **must** have:
  * an `asset` attribute;
  * a public function `isDirty` that returns `true` if there are unsaved changes;
  * a public function `saveAsset`. It will be used when a tab is closed and a user chooses to save the changes in the asset.
* An editor may also call `opts.ondone` when it requests its tab to be closed. It must pass its asset as function's only argument. The app view assumes that the asset editor has already managed all the saving/discard process.

**Tip:** Most of the repetitive stuff is handled by `discardio` mixin: it fully implements `isDirty` method, publishes `this.asset` property you can safely use in an asset editor, and `writeChanges` and `discardChanges` methods to commit edits to a project.
