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
        function valid(obj: Copy): asserts obj is LivingCopy;
        function valid(obj: PIXI.DisplayObject | any): obj is PIXI.DisplayObject;
    }
}
