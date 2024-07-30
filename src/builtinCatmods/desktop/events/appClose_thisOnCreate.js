if (desktop.isNeutralino) {
    this.onAppClose = () => {
        /*%%USER_CODE%%*/
    };
    Neutralino.events.on('windowClose', this.onAppClose);
}
