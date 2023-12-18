export const promptName = (type: resourceType, defaultName: string): Promise<string | false> =>
    new Promise((resolve) => {
        const promptTag = document.createElement('new-asset-prompt');
        document.body.appendChild(promptTag);
        // eslint-disable-next-line prefer-destructuring
        const riotTag: IRiotTag = riot.mount(promptTag, 'new-asset-prompt', {
            assettype: type,
            defaultname: defaultName,
            oncancelled: () => {
                riotTag.unmount();
                resolve(false);
            },
            onsubmitted: (name: string) => {
                riotTag.unmount();
                resolve(name);
            }
        })[0];
    });
