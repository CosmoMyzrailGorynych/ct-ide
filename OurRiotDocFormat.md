Maybe we will write a parser that outputs readable docs for these.

At `./src/riotTags`, use this syntax at the top of the file to document tags:

```pug
//
    Short description of a tag.

    A longer description, if appropriate.

    @slot
        This means that the tag yields the passed markup inside itself.
        A description of how the tag does it would be appropriate.

    @attribute attributeName (type)
        A descriotion of an attribute.
    @attribute [optionalAttributeName] (type, typeSpecificator)
        A descriotion of an attribute.

    @method callableMethod(x, y)
        A description of a tag's method that can be safely called for inter-module communications.
    @method callableMethodWithoutArguments
        A description of a tag's method that can be safely called for inter-module communications.
    @method callableMethod(x, y) (type, typeSpecificator)
        A description of a tag's method that can be safely called for inter-module communications.

    @property propertyName (type, typeSpecificator)
        A description of an exposed property of a tag.
```

Optional attributes are inside square brackets.

A `type` is one of:

* `riot ${type}`, where a `${type}` is a TypeScript spec of a field, usually a mutable object. E.g. `riot function`, `riot Array<number>`. Here `riot` means that the value should be passed as a riot attribute in form of `attribute="{dynamicValue}"`.
* a constant's type, e.g. `string`, `number`, `boolean`.
* `atomic`, for attributes-switches, when the existence of an attribute is more important than its value (think of `disabled="disabled"` attribute in HTML).
    * in 99.9%, `atomic` attributes are optional and need square brackets.

A `typeSpecificator` is a more detailed notation of a type in TypeScript fashion, e.g. for a string, it may be `'left'|'right'|'top'|'bottom'`. So the whole line may look like this:

```
@attribute direction (string, 'left'|'right'|'top'|'bottom')
```