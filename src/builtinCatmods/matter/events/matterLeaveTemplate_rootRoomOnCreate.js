{
    const [templateName] = [/*%%ENTITY_NAME%%*/];
    window.matter.rulebookEnd.push({
        mainTemplate: templateName,
        otherTemplate: [/*%%template%%*/][0],
        // eslint-disable-next-line no-unused-vars
        func: function (other) {
            /*%%USER_CODE%%*/
        }
    });
}
