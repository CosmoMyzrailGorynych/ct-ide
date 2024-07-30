{
    const [templateName] = [/*%%ENTITY_NAME%%*/];
    window.matter.rulebookEnd.push({
        mainTemplate: templateName,
        any: true,
        // eslint-disable-next-line no-unused-vars
        func: function (other) {
            /*%%USER_CODE%%*/
        }
    });
}
