type ungroupedAssetGroup = {
    isUngroupedGroup: true
};
type customAssetGroup = {
    isUngroupedGroup?: false,
    name: string,
    icon: string,
    colorClass: string,
    uid: string
}

type assetGroup = ungroupedAssetGroup | customAssetGroup;
