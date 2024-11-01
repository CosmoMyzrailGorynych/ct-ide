import cssnano from 'cssnano';

export default async (input: string): Promise<string> => (await cssnano().process(input)).css;
