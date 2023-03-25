import {IRoomEditorInteraction} from '.';

export const tab: IRoomEditorInteraction<void> = {
    ifListener: 'tab',
    if() {
        return true;
    },
    listeners: {
        tab(e: KeyboardEvent, roomTag, affixedData, callback) {
            if (this.copiesVisible) {
              // Apply any possible property changes to the previous selectio set
                this.riotEditor.refs.propertiesPanel.applyChanges();

                const copies = Array.from(this.copies.values())
                .sort((a, b) => (a.y - b.y) || (a.x - b.x));
                const index = (this.currentSelection.size === 1) ?
                    copies.indexOf(this.currentSelection.values().next().value) :
                    -1;
                if (index > -1 && !e.shiftKey) {
                    this.currentSelection.clear();
                    this.currentSelection.add(copies[(index + 1) % copies.length]);
                } else if (index > -1 && e.shiftKey) {
                    this.currentSelection.clear();
                    this.currentSelection.add(copies[(copies.length + index - 1) % copies.length]);
                } else {
                    this.currentSelection.clear();
                    this.currentSelection.add(copies[0]);
                }
                this.transformer.setup();
                this.riotEditor.refs.propertiesPanel.updatePropList();
            }
            callback();
        }
    }
};
