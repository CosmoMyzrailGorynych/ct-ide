const getById = (id: string): IStyle => {
    const style = (global.currentProject as IProject).styles.find((s: IStyle) => s.uid === id);
    if (!style) {
        throw new Error(`Attempt to get a non-existent style with ID ${id}`);
    }
    return style;
};

export {getById};
