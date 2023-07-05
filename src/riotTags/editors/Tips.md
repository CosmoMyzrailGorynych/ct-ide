* Skeletons are edited by texture-editor.tag
* You can register editors for new asset types at `node_requires/resources`

TODO:

* Editors **must not** edit the asset directly. Instead, they should create a copy first and then save or discard it.
* Each editor **must** have:
  * an `asset` attribute;
  * a public function `isDirty` that returns `true` if there are unsaved changes;
  * a public function `saveAsset`. It will be used when a tab is closed and a user chooses to save the changes in the asset.
