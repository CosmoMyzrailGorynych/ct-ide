type enumId<id extends string> = `enum@${id}`;

declare interface IFieldSchema {
    name: string,
    readableName: string,
    type: resourceType | 'text' | 'textfield' | 'code' | 'number' | 'sliderAndNumber' | 'checkbox' | 'color',
    required: boolean,
    structure: 'atomic' | 'array' | 'map',
    mappedType?: IFieldSchema['type'],
    fixedLength?: number
}
