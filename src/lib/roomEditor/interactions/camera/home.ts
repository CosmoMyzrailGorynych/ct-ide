import {IRoomEditorInteraction} from '..';

const goHome: IRoomEditorInteraction<void> = {
    ifListener: 'home',
    if() {
        return true;
    },
    listeners: {
        home(e, riotTag, affixedData, callback) {
            this.goHome();
            callback();
        }
    }
};

export {goHome};
