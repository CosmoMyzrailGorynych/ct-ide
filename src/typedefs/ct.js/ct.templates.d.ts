declare class LivingCopy extends Copy {
    kill: true
}

declare namespace ct {
    namespace templates {
        /**
         * Checks whether a given object exists in game's world.
         * Intended to be applied to copies, but may be used with other PIXI entities.
         * @param {Copy|PIXI.DisplayObject|any} obj The copy which existence needs to be checked.
         * @returns {boolean} Returns `true` if a copy exists; `false` otherwise.
         */
        function valid(obj: Copy): obj is LivingCopy;
        function valid(obj: PIXI.DisplayObject): obj is PIXI.DisplayObject;
        function valid(obj: any): obj is LivingCopy;

        /**
         * Checks whether a given object is a ct.js copy.
         * @param {any} obj The object which needs to be checked.
         * @returns {boolean} Returns `true` if the passed object is a copy; `false` otherwise.
         */
        function isCopy(obj: unknown): obj is Copy;
    }
}
