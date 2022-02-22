const getThumbnail = function getThumbnail(): string {
    return 'sparkles';
};
const getById = function getById(id: string): ITandem {
    const tandem = (window as Window).currentProject.tandems.find((t: ITandem) => t.uid === id);
    if (!tandem) {
        throw new Error(`Attempt to get a non-existent tandem with ID ${id}`);
    }
    return tandem;
};

export {
    getThumbnail,
    getById
};
