{
    const [templateName] = [/*%%ENTITY_NAME%%*/];
    window.matter.rulebookStart.push({
        mainTemplate: templateName,
        otherTemplate: [/*%%template%%*/][0],
        // eslint-disable-next-line no-unused-vars
        func: function (other, impact) {
            /*%%USER_CODE%%*/
        }
    });
}
