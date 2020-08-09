declare namespace ct {
    /**
     * A module that brings inheritance capabilities to your copies.
     */
    namespace inherit {

        /**
         * Checks whether a first given entity is a child of another.
         * You can check one copy against another, or a copy against a type name (a string),
         * or the reverse, or even use type names only, meaning that `ct.inherit.isChild(this, 'Godwoken')`
         * will work and will return the expected result.
         *
         * @param {Copy|string} copy The copy to check against, or the name of a type
         * @param {Copy|string} assertedParent The copy that may be the parent of `copy`, or the name of a type.
         *
         * @returns `true` if the type of a first entity is a child type of a second one,
         * or if this is one type. Returns `false` otherwise. If you don't want copies
         * of one type to match, compare their `type` parameters mnually prior to using `isChild`.
         */
        function isChild(copy: Copy | string, assertedParent: Copy | string): boolean;

        /**
         * Checks whether a first given entity is a parent of another.
         * You can check one copy against another, or a copy against a type name (a string),
         * or the reverse, or even use type names only, meaning that `ct.inherit.isParent('AbstractMonster', this)`
         * will work and will return the expected result.
         *
         * @param {Copy|string} copy The copy to check against, or the name of a type
         * @param {Copy|string} assertedChild The copy that may be the child of `copy`, or the name of a type.
         *
         * @returns `true` if the type of a first entity is a parent type of a second one,
         * or if this is one type. Returns `false` otherwise. If you don't want copies
         * of one type to match, compare their `type` parameters mnually prior to using `isParent`.
         */
        function isParent(copy: Copy | string, assertedChild: Copy | string): boolean;

        /**
         * Returns an array of all the copies of a particular type and its children.
         */
        function list(type: string): Array<Copy>;
    }
}


interface Copy {
    /**
     * This module implements type inheritance for your types.
     */
    inherit: {
        /**
         * Calls the onCreate method of this copy's parent
         * (in sense of type inheritance, not in sense of scene graph).
         * Provided by `ct.inherit` module.
         * */
        onCreate(): void;
        /**
         * Calls the onStep method of this copy's parent
         * (in sense of type inheritance, not in sense of scene graph).
         * Provided by `ct.inherit` module.
         * */
        onStep(): void;
        /**
         * Calls the onDraw method of this copy's parent
         * (in sense of type inheritance, not in sense of scene graph).
         * Provided by `ct.inherit` module.
         * */
        onDraw(): void;
        /**
         * Calls the onDestroy method of this copy's parent
         * (in sense of type inheritance, not in sense of scene graph).
         * Provided by `ct.inherit` module.
         * */
        onDestroy(): void;
    }
}